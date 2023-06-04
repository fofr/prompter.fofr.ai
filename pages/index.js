import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import PromptForm from "../components/PromptForm";
const title = "Prompter";

export default function Home() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    async function fetchLists() {
      const res = await fetch("/api/lists");
      const data = await res.json();
      setLists(data);
    }

    fetchLists();
  }, []);

  return (
    <div>
      <div className="container max-w-4xl mx-auto px-8 py-4 pb-10 bg-white border-black min-h-screen">
        <Head>
          <title>Prompt generator for AI images and media</title>
        </Head>

        <nav className="mb-8">
          <ul className="flex justify-center bg-amber-100 -mx-8 -mt-4 p-4 mb-10">
            <li className="mr-6">
              <Link href="https://twitter.com/fofrAI" className="underline">Made by @fofrAI</Link>
            </li>
            <li className="mr-6">
              <Link href="/about" className="underline">Explore lists</Link>
            </li>
            <li className="mr-6">
              <Link href="https://github.com/ai-prompts/prompt-lists" className="underline">Contribute</Link>
            </li>
          </ul>
        </nav>

        <h1 className="calistoga md:text-8xl text-6xl text-black text-center mb-12 pt-10">
          {title}
        </h1>

        <PromptForm />

        {/* {Object.entries(lists).map(([category, categoryLists]) => (
          <div key={category}>
            <h2 className="text-l font-semibold mb-2 mt-4">{category}</h2>
            {categoryLists.map((list) => (
              <ul key={list}>
                <li>
                  <Link href={`/list/${list}`}>
                    {list}
                  </Link>
                </li>
              </ul>
            ))}
          </div>
        ))} */}
      </div>
    </div>
  );
}
