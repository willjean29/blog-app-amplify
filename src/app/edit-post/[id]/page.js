"use client"
import { client } from "@/app/amplify-config";
import { getPost } from "@/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "@/graphql/mutations";
import { getUrl, uploadData } from "aws-amplify/storage";
import { v4 as uuid } from 'uuid';

export default function EditPostById() {
  const [post, setPost] = useState({
    title: '',
    content: '',
  })
  console.log({ post })
  const [coverImage, setCoverImage] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const imageFileInput = useRef(null);
  const params = useParams();
  const router = useRouter();
  const { title, content } = post;
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

        if (data.getPost.coverImage) {
          const result = await getUrl({
            key: data.getPost.coverImage,
            options: { level: 'public' }
          });
          console.log({ result })
          setCoverImage(result.url);
        }

        setPost({
          title: data.getPost.title,
          content: data.getPost.content,
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
    post.id = params.id;
    try {
      if (coverImage && localImage) {
        const filename = `${coverImage.name}_${uuid()}`;
        post.coverImage = filename;
        const result = await uploadData({
          key: filename,
          path: `/public/${filename}`,
          data: coverImage,
        }).result;
        console.log('Succeeded: ', result);
      }
      await client.graphql({
        query: updatePost,
        variables: {
          input: post
        },
        authMode: 'userPool'
      })
      router.push('/my-posts');
    } catch (error) {
      console.log({ error });
    }
  }

  const handleChange = (e) => {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setLocalImage(URL.createObjectURL(fileUploaded));
    setCoverImage(fileUploaded);
  }
  const uploadImage = () => {
    imageFileInput.current.click();
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 ">Edit Post</h1>
      {
        coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="my-4" src={localImage ? localImage : coverImage} alt="image cover to post" width={300} height={300} />
        )
      }
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
      <input
        type="file"
        ref={imageFileInput}
        className="absolute w-0 h-0"
        onChange={handleChange}
      />
      <button type="button" onClick={() => uploadImage()} className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg mr-2">Upload Cover Image</button>
      <button type="button" onClick={() => updateCurrentPost()} className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg ">Update Post</button>
    </div>
  );
}