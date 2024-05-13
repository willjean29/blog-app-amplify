"use client"

import { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { client } from './amplify-config';
import Link from 'next/link';

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
        posts.map((post, index) => (
          <Link key={index} href={`/posts/${post.id}`}>
            <div key={post.id} className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500 mt-2">Author: {post.username}</p>
            </div>
          </Link>

        ))
      }
    </main>
  );
}
