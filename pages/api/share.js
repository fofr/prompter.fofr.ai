import db from "../../lib/db";

const shareTemplate = async (promptTemplate) => {
  // Call the stored procedure to increment 'share_count'
  const { data: rpcData, error: rpcError } = await db
    .rpc('increment_share', {
      tmpl: promptTemplate
    })

  // If the stored procedure did not affect any rows, insert a new row.
  if (!rpcData || rpcData.length === 0) {
    const { data: insertData, error: insertError } = await db
      .from('generations')
      .insert({
        template: promptTemplate,
        share_count: 1,
      })
      .select('id')

    if (insertError) {
      throw new Error(insertError.message);
    }

    return insertData[0].id;
  }

  if (rpcError) {
    throw new Error(rpcError.message);
  }

  return rpcData;
}

export default async function handler(req, res) {
  const prompt = req.body.promptTemplate;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const id = await shareTemplate(prompt);
    return res.status(200).json(id);
  } catch (error) {
    console.error('Database operation failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
