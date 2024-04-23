import React from 'react'
import Link from 'next/link'

const data = [
  { url: '/', title: 'Home' },
  { url: '/create-post', title: 'Create Post' },
  { url: '/profile', title: 'Profile' },
];

const Navbar = () => {
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
    </nav>
  )
}

export default Navbar;