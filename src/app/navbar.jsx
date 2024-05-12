"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Hub } from 'aws-amplify/utils';

import { getCurrentUser } from 'aws-amplify/auth';
const data = [
  { url: '/', title: 'Home' },
  { url: '/create-post', title: 'Create Post' },
  { url: '/profile', title: 'Profile' },
];

const Navbar = () => {
  const [signedUser, setSignedUser] = useState(false);
  useEffect(() => {
    authListener();
  }, [])

  const authListener = async () => {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signedIn':
          setSignedUser(true);
          break;
        case 'signedOut':
          setSignedUser(false);
          break;
      }
    });
    try {
      await getCurrentUser();
      setSignedUser(true);
    } catch (err) {
      // setSignedUser(false);
    }
  };
  return (
    <nav
      className='flex justify-center pt-3 pb-3
        space-x-4 border-b bg-cyan-500 border-gray-300'
    >
      {data.map(({ url, title }, index) => (
        <Link href={url} key={index} className='rounded-lg px-3 py-2 
            text-slate-700
             font-medium hover:bg-slate-100 hover:text-slate-900'>
          {title}
        </Link>
      ))}
      {
        signedUser && (
          <Link href="/my-posts" className='rounded-lg px-3 py-2 text-slate-700
              font-medium hover:bg-slate-100 hover:text-slate-900'>
            My Posts
          </Link>
        )
      }
    </nav>
  )
}

export default Navbar;