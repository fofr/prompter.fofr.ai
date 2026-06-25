import Head from "next/head";
import Navbar from "../components/Navbar";
import Meta from "../components/Meta";
import JsonTemplateBuilder from "../components/JsonTemplateBuilder";

const title = "JSON templates";

export default function JsonTemplates() {
  return (
    <div>
      <div className="container max-w-4xl mx-auto px-8 py-4 pb-10 bg-white border-black min-h-screen">
        <Head>
          <title>JSON prompt templates — Prompter</title>
          <Meta />
        </Head>

        <Navbar />

        <h1 className="calistoga md:text-7xl text-5xl text-black text-center mb-6 pt-10">
          {title}
        </h1>

        <p className="mb-8 text-center max-w-2xl mx-auto">
          Craft structured JSON prompts with <code>[category.list]</code> tokens,
          then generate filled-in variations to drop straight into Explorer.
        </p>

        <JsonTemplateBuilder />
      </div>
    </div>
  );
}
