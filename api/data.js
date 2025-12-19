import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await kv.get('my-json-store');
      res.status(200).json(data || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to get data' });
    }
    return;
  }
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      await kv.set('my-json-store', body);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' });
    }
    return;
  }
  if (req.method === 'PUT') {
    try {
      const existing = await kv.get('my-json-store') || {};
      const updates = await req.json();
      const merged = { ...existing, ...updates };
      await kv.set('my-json-store', merged);
      res.status(200).json({ success: true, data: merged });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update data' });
    }
    return;
  }
  if (req.method === 'DELETE') {
    try {
      await kv.del('my-json-store');
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete data' });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}

module.exports = handler;
