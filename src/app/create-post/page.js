"use client";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { client } from "../amplify-config";
import { createPost } from '../../graphql/mutations';
import { useRouter } from "next/navigation";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Authenticator } from "@aws-amplify/ui-react";
import Image from "next/image";
export default function CreatePost() {
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  })
  const [image, setImage] = useState(null);
  const imageFileInput = useRef(null);
  const { title, content } = newPost;
  const router = useRouter();
  const onChange = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value
    })
  }

  const createNewPost = async () => {
    if (!title || !content) return;
    const id = uuid();
    console.log({ title, content })
    try {
      await client.graphql({
        query: createPost,
        variables: {
          input: {
            id,
            title,
            content
          }
        },
        authMode: 'userPool'
      })
      router.push(`/posts/${id}`)
    } catch (error) {
      console.log({ error })
    }
  }

  const uploadImage = () => {
    imageFileInput.current.click();
  }
  const handleChange = (e) => {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setImage(fileUploaded);
  }
  console.log({ image })
  return (
    <Authenticator>
      {() => (
        <div>
          <h1 className="text-3xl font-semibold tracking-wide mt-6 ">Create Post</h1>
          <input
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Title"
            className="border-b pb-2 text-lg my-4 focus:outline-none w-full text-gray-500"
          />
          {
            image && (
              <Image className="my-4" src={URL.createObjectURL(image)} alt="image cover to post" width={300} height={300} />
            )
          }
          <SimpleMDE
            value={content}
            onChange={(value) => setNewPost({ ...newPost, content: value })}
          />
          <input
            type="file"
            ref={imageFileInput}
            className="absolute w-0 h-0"
            onChange={handleChange}
          />
          <button type="button" onClick={() => uploadImage()} className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg mr-2">Upload Cover</button>
          <button type="button" onClick={createNewPost} className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg ">Create Post</button>
        </div>
      )}
    </Authenticator>

  );
}