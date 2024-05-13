
"use client";
import { client } from "@/app/amplify-config";
import { listPosts, getPost } from "@/graphql/queries";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";

export default function PostById() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    username: ''
  })
  const params = useParams();

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
      }
    }
    getPostById();
  }, [params.id])

  return (
    <div>
      <h1 className="text-5xl font-semibold tracking-wide">{post.title}</h1>
      <p className="text-sm font-light my-4">By {post.username}</p>
      <div className='mt-8'>
        <ReactMarkDown className='prose'>
          {post.content}
        </ReactMarkDown>
      </div>
    </div>
  );
}
