"use client"

import { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { client } from '@/amplify-config';

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const posts = await client.graphql({
          query: listPosts
        });
        console.log({ posts })
        setPosts(posts.data.listPosts.items)
      } catch (error) {
        console.log({ error });
      }
    }

    getAllPosts();
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">My posts</h1>
      {
        posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-4 my-4 w-1/2">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-gray-800">{post.content}</p>
          </div>
        ))
      }
    </main>
  );
}
