import Head from "next/head";
import PromptForm from "../components/PromptForm";
import Navbar from "../components/Navbar";
import Meta from "../components/Meta";
import Link from "next/link";
const title = "Prompter";

export default function Home() {
  return (
    <div>
      <div className="container max-w-4xl mx-auto px-8 py-4 pb-10 bg-white border-black min-h-screen">
        <Head>
          <title>Prompt generator for AI images and media</title>
          <Meta />
        </Head>

        <Navbar />

        <h1 className="calistoga md:text-8xl text-6xl text-black text-center mb-12 pt-10">
          {title}
        </h1>

        <div className="mb-6">
          <h3 class="font-bold text-lg mb-2">How to write a prompt</h3>
          <p className="mb-2">Try using a ‘[’ character to open a drop-down menu of all available lists, like [animal.all].<br />When you generate prompts, an item is picked from each list, such as giraffe or lion for [animal.all].</p>
          <Link className="underline" href="/explore">Explore the available lists</Link>
        </div>

        <PromptForm />
      </div>
    </div>
  );
}
