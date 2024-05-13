
"use client";
import { client } from "@/app/amplify-config";
import { getPost } from "@/graphql/queries";
import { getUrl } from "aws-amplify/storage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";

export default function PostById() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    username: ''
  })
  const [image, setImage] = useState(null);
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
    </div>
  );
}
