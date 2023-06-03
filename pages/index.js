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
      <div className="container max-w-4xl mx-auto px-8 py-10 bg-white border-black min-h-screen border-r-8 border-l-8 drop-shadow-2xl">
        <Head>
          <title>{title}</title>
        </Head>

        <h1 className="app-prompter-title text-center">
          {title}
        </h1>
        <p className="text-2xl font-bold text-center mb-8">
          Generate prompts and share your templates
        </p>

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
