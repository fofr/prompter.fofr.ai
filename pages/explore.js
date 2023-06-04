import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const title = "Explore lists";

export default function Explore() {
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
          <title>Explore lists of keywords – Prompter</title>
        </Head>

        <Navbar />

        <h1 className="calistoga md:text-6xl text-4xl text-black text-center mb-12 pt-10">
          {title}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(lists).map(([category, categoryLists]) => (
            <div key={category} className="border-b-2 px-2 pt-2 pb-6">
              <h2 className="text-xl font-semibold mb-2 mt-4">{category}</h2>
              {categoryLists.map((list) => (
                <ul key={list.title} >
                  <li>
                    <Link href={`/explore/${list.value}`} className="underline">
                      {list.title}
                    </Link>
                  </li>
                </ul>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
