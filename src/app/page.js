"use client"

import { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { client } from './amplify-config';

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const posts = await client.graphql({
          query: listPosts
        });
        setPosts(posts.data.listPosts.items)
      } catch (error) {
      }
    }

    getAllPosts();
  }, [])


  return (
    <main className="">
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-8'>Posts</h1>
      {
        posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-4 my-4 w-1/2">
            <h2 className="text-2xl font-bold">{post.title}</h2>
          </div>
        ))
      }
    </main>
  );
}
