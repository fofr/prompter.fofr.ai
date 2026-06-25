import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import debounce from "lodash.debounce";
import autocompleteLists from "prompt-lists/lists.json";
import Link from "next/link";

const tokenList = [...autocompleteLists];
if (!tokenList.includes("random")) tokenList.push("random");
tokenList.sort();

// Demo template showcasing every supported form. All keys verified to exist.
const STARTER = `{
  "subject": "[character.fantasy]",
  "art_style": [art.style],
  "two_styles": [art.style, 2],
  "artist_reference": [artist.all],
  "color_palette": [color.palette],
  "lighting": [photography.light],
  "camera": "[photography.camera] with a [photography.lens]",
  "mood": [feeling.all],
  "tags": [[art.style], [art.style], [art.style]],
  "scene": "A [art.style] scene of [character.fantasy], lit by [photography.light]",
  "year": [time.year]
}`;

const Item = ({ entity }) => <div className="px-1">{`${entity}`}</div>;

const JsonTemplateBuilder = () => {
  const [template, setTemplate] = useState(STARTER);
  const [preview, setPreview] = useState(null); // resolved object
  const [error, setError] = useState(null); // { message, output? }
  const [variations, setVariations] = useState([]);
  const [count, setCount] = useState(8);
  const [copied, setCopied] = useState("");
  const textareaRef = useRef(null);

  const apply = (data) => {
    if (data.error) {
      setError({ message: data.error, output: data.output });
      setPreview(null);
    } else {
      setPreview(data.prompts[0]);
      setError(null);
    }
  };

  const fetchPreview = useCallback((tpl) => {
    fetch("/api/generate-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: tpl, count: 1 }),
    })
      .then((r) => r.json())
      .then(apply)
      .catch((e) => setError({ message: String(e) }));
  }, []);

  const debouncedPreview = useRef(debounce((tpl) => fetchPreview(tpl), 400)).current;

  useEffect(() => {
    fetchPreview(STARTER);
  }, [fetchPreview]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTemplate(value);
    debouncedPreview(value);
  };

  const generate = () => {
    fetch("/api/generate-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, count }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError({ message: data.error, output: data.output });
        } else {
          setVariations(data.prompts);
          setError(null);
        }
      })
      .catch((e) => setError({ message: String(e) }));
  };

  const copy = (obj, key) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(key);
    setTimeout(() => setCopied(""), 1200);
  };

  // Copy every variation minified onto its own line (NDJSON), so it drops
  // straight into batch tools that take one prompt per line.
  const copyAllLines = () => {
    navigator.clipboard.writeText(variations.map((v) => JSON.stringify(v)).join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <div>
      <div className="bg-gray-50 border-2 border-gray-200 p-4 mb-6 text-sm">
        <p className="mb-1">
          Write JSON and drop in <code>[category.list]</code> tokens (type{" "}
          <code>[</code> for autocomplete). On generate, each token is filled
          from prompt-lists:
        </p>
        <ul className="list-disc ml-5 space-y-0.5">
          <li>
            <code>[art.style]</code> — a bare token becomes a quoted string →{" "}
            <code>&quot;art deco&quot;</code>
          </li>
          <li>
            <code>[art.style, 2]</code> — pick N, comma-joined →{" "}
            <code>&quot;art deco, bauhaus&quot;</code>
          </li>
          <li>
            <code>&quot;a [art.style] by [artist.all]&quot;</code> — tokens
            inside a string interpolate in place
          </li>
          <li>
            <code>[[art.style], [art.style]]</code> — an array of independent
            picks → <code>[&quot;art deco&quot;, &quot;bauhaus&quot;]</code>
          </li>
        </ul>
        <Link className="underline inline-block mt-2" href="/explore">
          Browse the available lists
        </Link>
      </div>

      <label className="text-lg font-bold mb-2 block">Template</label>
      <ReactTextareaAutocomplete
        value={template}
        onChange={handleChange}
        className="w-full border-2 border-gray-600 p-4 font-mono text-sm"
        rows={16}
        spellCheck="false"
        minChar={0}
        loadingComponent={() => <span></span>}
        innerRef={(ta) => {
          textareaRef.current = ta;
        }}
        trigger={{
          "[": {
            dataProvider: (token) =>
              token
                ? tokenList.filter((l) =>
                    l.toLowerCase().includes(token.toLowerCase())
                  )
                : tokenList,
            component: Item,
            output: (item) => {
              const ta = textareaRef.current;
              const selection = ta ? ta.selectionStart : 0;
              const value = ta ? ta.value : "";
              const nextChar = value[selection];
              return {
                text: nextChar === "]" ? `[${item}` : `[${item}]`,
                caretPosition: "end",
              };
            },
          },
        }}
      />

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button type="button" className="button" onClick={() => fetchPreview(template)}>
          🎲 Re-roll
        </button>
        <button
          type="button"
          className="button"
          disabled={!preview}
          onClick={() => copy(preview, "preview")}
        >
          {copied === "preview" ? "Copied!" : "Copy JSON"}
        </button>
        <span className="mx-1 text-gray-400">|</span>
        <button type="button" className="button" onClick={generate}>
          Generate
        </button>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
          className="border-2 border-gray-600 p-2 w-20"
          aria-label="number of variations"
        />
        <span className="text-sm text-gray-600">variations</span>
      </div>

      {error && (
        <div className="mt-6 border-2 border-red-400 bg-red-50 p-4">
          <p className="font-bold text-red-700 mb-1">⚠ {error.message}</p>
          {error.output && (
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-red-900">
              {error.output}
            </pre>
          )}
        </div>
      )}

      {!error && preview && (
        <div className="mt-6">
          <label className="text-lg font-bold mb-2 block">Preview</label>
          <pre className="border-2 border-gray-300 bg-gray-50 p-4 text-sm overflow-x-auto">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}

      {variations.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-bold">{variations.length} variations</label>
            <button
              type="button"
              className="button"
              onClick={copyAllLines}
            >
              {copied === "all" ? "Copied!" : "Copy all (one per line)"}
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {variations.map((v, i) => (
              <div key={i} className="border-2 border-gray-300 relative">
                <button
                  type="button"
                  className="absolute top-1 right-1 text-xs underline text-gray-500"
                  onClick={() => copy(v, `v${i}`)}
                >
                  {copied === `v${i}` ? "Copied!" : "Copy"}
                </button>
                <pre className="p-3 text-xs overflow-x-auto">
                  {JSON.stringify(v, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonTemplateBuilder;
