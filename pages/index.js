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
    <div className="bg-gradient-to-br from-white to-gray-100 h-screen">
      <div className="container max-w-3xl mx-auto p-5">
        <Head>
          <title>{title}</title>
        </Head>

        <h1 className="app-prompter-title">
          {title}
        </h1>
        <p className="text-2xl text-slate-500 mb-8">
          Generate prompts, share your templates
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
