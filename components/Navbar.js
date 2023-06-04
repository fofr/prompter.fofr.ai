import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="mb-8">
      <ul className="flex justify-center bg-amber-100 -mx-8 -mt-4 p-4 mb-10">
        <li className="mr-4 md:mr-6">
          <Link href="https://twitter.com/fofrAI" className="underline"><span className="hidden sm:inline">Made by </span>@fofrAI</Link>
        </li>
        <li className="mr-4 md:mr-6">
          <Link href="/" className="underline">Generate<span className="hidden sm:inline"> prompts</span></Link>
        </li>
        <li className="mr-4 md:mr-6">
          <Link href="/explore" className="underline">Explore<span className="hidden sm:inline"> lists</span></Link>
        </li>
        <li className="mr-4 md:mr-6">
          <Link href="https://github.com/ai-prompts/prompt-lists" className="underline">Contribute</Link>
        </li>
        <li className="mr-4 md:mr-6 hidden sm:block">
          <Link href="https://ko-fi.com/fofrai" className="underline">Buy me a coffee</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
