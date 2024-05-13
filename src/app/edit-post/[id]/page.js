"use client"
import { client } from "@/app/amplify-config";
import { getPost } from "@/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "@/graphql/mutations";

export default function EditPostById() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    username: ''
  })
  const params = useParams();
  const router = useRouter();
  const { title, content, username } = post;
  const onChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value
    })
  }
  useEffect(() => {
    const getPostById = async () => {
      try {
        const { data } = await client.graphql({
          query: getPost,
          variables: {
            id: params.id
          }
        });
        console.log({ data });
        setPost({
          title: data.getPost.title,
          content: data.getPost.content,
          username: data.getPost.username
        });
      }
      catch (error) {
        console.log({ error });
        router.replace('/my-posts');
      }
    }
    getPostById();
  }, [params.id, router])
  const updateCurrentPost = async () => {
    try {
      await client.graphql({
        query: updatePost,
        variables: {
          input: {
            id: params.id,
            title,
            content
          }
        },
        authMode: 'userPool'
      })
      router.push('/my-posts');
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 ">Edit Post</h1>
      <input
        name="title"
        value={title}
        onChange={onChange}
        placeholder="Title"
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full text-gray-500"
      />
      <SimpleMDE
        value={content}
        onChange={(value) => setPost({ ...newPost, content: value })}
      />
      <button type="button" onClick={() => updateCurrentPost()} className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg ">Update Post</button>
    </div>
  );
}