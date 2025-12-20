import { createClient } from '@supabase/supabase-js';


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('json_data').select('data').order('created_at', { ascending: false }).limit(1);
      if (error) throw error;
      return res.status(200).json(data[0]?.data || {});
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { error } = await supabase.from('json_data').insert([{ data: body }]);
      if (error) throw error;
      return res.status(200).json({ success: true, data: body });
    }

    if (req.method === 'PUT') {
      const updates = await req.json();
      const { data: current, error: fetchError } = await supabase.from('json_data').select('data').order('created_at', { ascending: false }).limit(1);
      if (fetchError) throw fetchError;
      const merged = { ...(current[0]?.data || {}), ...updates };
      const { error: updateError } = await supabase.from('json_data').insert([{ data: merged }]);
      if (updateError) throw updateError;
      return res.status(200).json({ success: true, data: merged });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('json_data').delete();
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}
