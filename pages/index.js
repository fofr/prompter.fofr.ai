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
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>{title}</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        {title}
      </h1>

      <PromptForm />

      {Object.entries(lists).map(([category, categoryLists]) => (
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
      ))}
    </div>
  );
}
