import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const allowedOrigins = ['https://intergramx.github.io', 'https://scrajang-studios.github.io', 'https://shaman2016scratch.github.io'];
  const origin = req.headers.origin;

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({
      ok: false,
      error: 'ORIGIN'
    });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    let supabaseResponse;

    if (req.method === 'GET') {
      supabaseResponse = await supabase.from('json_data').select('data').order('created_at', { ascending: false }).limit(1);
      if (supabaseResponse.error) throw supabaseResponse.error;
      const data = supabaseResponse.data[0]?.data || {};
      return res.status(200).json({
        intergramX: data.intergramX || {},
        ScraJang: data.ScraJang || {},
        status: {
          from_url: origin,
          text: '200, OK',
          code: '200',
          server_response: { status: 200 },
          supabase_response: supabaseResponse
        }
      });
    }
    return res.status(405).json({
      ok: false,
      error: 'Method not found'
    });

  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({
      ok: false,
      error: error
    });
  }
}
