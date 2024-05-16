"use client"

import { useEffect, useState } from 'react';
import { listPosts } from '../graphql/queries';
import { client } from './amplify-config';
import Link from 'next/link';
import { getUrl } from 'aws-amplify/storage';
import { newOnCreatePost } from '@/graphql/subscriptions';

export default function Home() {
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState([]);
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const posts = await client.graphql({
          query: listPosts
        });

        const { items } = posts.data.listPosts;

        const postsWithImages = await Promise.all(items.map(async post => {
          if (post.coverImage) {
            const result = await getUrl({
              key: post.coverImage,
              options: { level: 'public' }
            });
            post.coverImage = result.url;
          }
          return post;
        }));
        console.log({ postsWithImages })
        setPosts(postsWithImages)
      } catch (error) {
      }
    }

    getAllPosts();
  }, [post])

  useEffect(() => {
    let subOnCreate;
    const listenSubscriptions = async () => {
      subOnCreate = await client.graphql({
        query: newOnCreatePost
      }).subscribe((postData) => {
        console.log({ postData });
        setPost(postData)
      })
    }

    listenSubscriptions();

    return () => {
      if (subOnCreate) {
        subOnCreate.unsubscribe();
      }
    }
  }, [])

  return (
    <main className="">
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-8'>Posts</h1>
      {
        posts.map((post, index) => (
          <Link key={index} href={`/posts/${post.id}`}>
            <div className="mt-6 pb-6 border-b border-gray-300">
              {
                post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImage} className='w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0' alt="image to post" />
                )
              }
              <div key={post.id} className="cursor-pointer pb-4">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-500 mt-2">Author: {post.username}</p>
                {post.comments.items.length > 0 &&
                  post.comments.items.map((comment, index) => (
                    <div
                      key={index}
                      className='py-8 px-8 max-w-xl mx-auto bg-white rounded-xl 
                    shadow-lg space-y-2 sm:py-1 sm:flex 
                    my-6 sm:items-center sm:space-y-0 sm:space-x-6 mb-2'
                    >
                      <div>
                        <p className='text-gray-500 mt-2'>{comment.message}</p>
                        <p className='text-gray-200 mt-1'>{comment.createdBy}</p>
                      </div>
                    </div>
                  ))}
              </div>

            </div>

          </Link>

        ))
      }
    </main>
  );
}
