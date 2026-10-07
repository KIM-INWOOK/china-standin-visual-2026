function database(env) {
  if (!env.DB) throw new Error('Reader opinion database is unavailable');
  return env.DB;
}
const json = (value, status=200) => Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/opinions') return env.ASSETS.fetch(request);
    try {
      const db = database(env);
      if (request.method === 'GET') {
        const rows=await db.prepare('SELECT id, task, price, created_at FROM reader_opinions ORDER BY created_at DESC LIMIT 100').all();
        return json({opinions:rows.results});
      }
      if (request.method !== 'POST') return json({error:'지원하지 않는 요청입니다.'},405);
      if (request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return json({error:'요청을 확인할 수 없습니다.'},403);
      if (Number(request.headers.get('Content-Length')) > 4096) return json({error:'의견이 너무 깁니다.'},413);
      const raw = await request.text();
      if (raw.length > 4096) return json({error:'의견이 너무 깁니다.'},413);
      let data;try{data=JSON.parse(raw);}catch{return json({error:'의견을 확인해주세요.'},400);}
      const task=typeof data.task==='string'?data.task.trim():'';
      const price=data.price;
      if(!task||task.length>300||!Number.isInteger(price)||price<0||price>1000000000)return json({error:'내용과 금액을 확인해주세요.'},400);
      const opinion={id:crypto.randomUUID(),task,price,created_at:Date.now()};
      await db.prepare('INSERT INTO reader_opinions (id, task, price, created_at) VALUES (?, ?, ?, ?)').bind(opinion.id,task,price,opinion.created_at).run();
      return json({opinion},201);
    } catch(error) {
      console.error('Reader opinion request failed',error);
      return json({error:'의견을 불러오거나 저장하지 못했습니다. 잠시 후 다시 시도해주세요.'},503);
    }
  }
};
