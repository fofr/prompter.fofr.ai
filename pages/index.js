import Head from "next/head";
import PromptForm from "../components/PromptForm";

const title = "Prompter";

export default function Home() {
  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>{title} by @fofrAI</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        {title}
      </h1>

      <PromptForm />
    </div>
  );
}
