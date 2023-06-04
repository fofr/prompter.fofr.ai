import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function List() {
  const router = useRouter();
  const [list, setList] = useState({});

  const fetchList = (listName) => {
    fetch('/api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listName })
    })
    .then((response) => response.json())
    .then((data) => {
      setList(data);
    })
    .catch((error) => {
      console.error('Failed to generate:', error);
    });
  };

  useEffect(() => {
    if (router.query.list) {
      fetchList(router.query.list);
    }
  }, [router.query]);

  return (
    <div>
      <div className="container max-w-4xl mx-auto px-8 py-4 pb-10 bg-white border-black min-h-screen">
        <Head>
          <title>{list.title}</title>
        </Head>

        <Navbar />

        <Link href="/explore" className="underline">← Back</Link>

        <h1 className="calistoga md:text-6xl text-4xl text-black mb-12 pt-10">
          <div className="text-gray-400 text-4xl mb-2">{router.query.list}</div>
          {list.title}
        </h1>

        <p class="mb-4">
          <span className="text-xl font-bold">{list.length && list.length.toLocaleString()} items</span><br />
          <Link className="text-l underline" href="https://github.com/ai-prompts/prompt-lists">Contribute to this list</Link>
        </p>

        <ol className={`grid ${list.columnClasses}`}>
        {list.list && list.list.map((item) => (
          <li key={item} className="py-1 pr-2">
            {item}
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}
