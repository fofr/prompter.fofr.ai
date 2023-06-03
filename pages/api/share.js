import db from "../../lib/db";

export default async function handler(req, res) {
  const prompt = req.body.promptTemplate;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const { data, error } = await db
    .from('prompts')
    .insert([
      { prompt },
    ])
    .select()

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data[0]);
}
