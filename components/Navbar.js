import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="mb-8">
      <ul className="flex justify-center bg-amber-100 -mx-8 -mt-4 p-4 mb-10">
        <li className="mr-6">
          <Link href="https://twitter.com/fofrAI" className="underline">Made by @fofrAI</Link>
        </li>
        <li className="mr-6">
          <Link href="/" className="underline">Generate prompts</Link>
        </li>
        <li className="mr-6">
          <Link href="/explore" className="underline">Explore lists</Link>
        </li>
        <li className="mr-6">
          <Link href="https://github.com/ai-prompts/prompt-lists" className="underline">Contribute</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
