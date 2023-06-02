import db from "../../lib/db";

export default async function handler(req, res) {
  const id = req.query.id;

  // check if id is a valid uuid
  if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { data, error } = await db
    .from('prompts')
    .select('*')
    .eq('id', id)

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || !data.length) {
    return res.status(404).json({ error: "Not found" });
  }

  res.end(JSON.stringify(data[0]));
}
