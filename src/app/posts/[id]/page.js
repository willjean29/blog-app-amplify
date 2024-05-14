
"use client";
import { client } from "@/app/amplify-config";
import { getPost } from "@/graphql/queries";
import { createComment } from "@/graphql/mutations";
import { getUrl } from "aws-amplify/storage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import { v4 as uuid } from 'uuid';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function PostById() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    username: ''
  })
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const params = useParams();
  const router = useRouter();
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
        if (data.getPost.coverImage) {
          const result = await getUrl({
            key: data.getPost.coverImage,
            options: { level: 'public' }
          });
          console.log({ result })
          setImage(result.url);
        }

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

  const onToggleEditor = () => {
    setShowEditor(!showEditor);
  }

  const createNewComment = async () => {
    const newComment = {
      id: uuid(),
      postID: params.id,
      message: comment
    }
    try {
      const result = await client.graphql({
        query: createComment,
        variables: {
          input: newComment
        },
        authMode: 'userPool'
      })
      console.log({ result })
      router.push('/my-posts')
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div>
      <h1 className="text-5xl font-semibold tracking-wide">{post.title}</h1>
      {
        image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="my-4" src={image} alt="image cover to post" width={300} height={300} />
        )
      }
      <p className="text-sm font-light my-4">By {post.username}</p>
      <div className='mt-8'>
        <ReactMarkDown className='prose'>
          {post.content}
        </ReactMarkDown>
      </div>
      <div className="my-2">
        <button type="button" className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={
          () => onToggleEditor()
        }>Write a comment</button>

        <div style={{ display: showEditor ? 'block' : 'none' }}>
          <SimpleMDE
            value={comment}
            onChange={(value) => setComment(value)}
          />
          <button type="button" className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={
            () => {
              createNewComment()
            }
          }>Save</button>
        </div>


      </div>
    </div>
  );
}
