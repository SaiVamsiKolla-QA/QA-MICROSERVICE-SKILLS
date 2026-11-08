import http from 'node:http';
import { pathToFileURL } from 'node:url';
export function createService(fault='healthy') {
  if(!['healthy','content','schema','authorization','state'].includes(fault)) throw Error('Unknown fault');
  const orders=new Map();const events=[];
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const send=(status,body)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));};
    if(url.pathname==='/health') return send(200,{ok:true});
    // Diagnostic endpoints belong only to this local synthetic service.
    if(url.pathname==='/__inventory') return send(200,{ids:[...orders.keys()]});
    if(url.pathname==='/__events') return send(200,events);
    const owner=req.headers.authorization==='Bearer alice-test'?'alice':req.headers.authorization==='Bearer bob-test'?'bob':null;
    if(!owner) return send(401,{error:'unauthorized'});
    const match=/^\/orders\/([^/]+)$/.exec(url.pathname);
    let data;
    if(req.method==='POST' && url.pathname==='/orders') {
      try {let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>10000)return send(413,{error:'too large'});}data=JSON.parse(raw);} catch{return send(400,{error:'invalid json'});}
      if(typeof data.id!=='string' || !/^[a-zA-Z0-9_-]+$/.test(data.id) || !Number.isInteger(data.quantity) || data.quantity<1 || data.quantity>10 || !Number.isInteger(data.unitPriceCents) || data.unitPriceCents<1 || data.unitPriceCents>100000) return send(422,{error:'invalid input'});
      if(orders.has(data.id)) return send(409,{error:'duplicate'});
      const stored={id:data.id,owner,quantity:data.quantity,unitPriceCents:data.unitPriceCents,totalCents:data.quantity*data.unitPriceCents};
      if(fault!=='state') orders.set(data.id,stored);
      events.push({method:'POST',id:data.id,owner,persisted:fault!=='state'});
      const output={...stored};if(fault==='content')output.totalCents++;
      if(fault==='schema')delete output.owner;
      return send(201,output);
    }
    if(match) {
      const id=decodeURIComponent(match[1]),item=orders.get(id);
      if(!item) return send(404,{error:'not found'});
      if(item.owner!==owner && fault!=='authorization')return send(403,{error:'forbidden'});
      if(req.method==='GET')return send(200,item);
      if(req.method==='DELETE'){orders.delete(id);events.push({method:'DELETE',id,owner});return send(200,{deleted:true});}
    }
    send(404,{error:'not found'});
  });
  return {server,orders,events};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const {server}=createService(process.env.FAULT??'healthy');
  server.listen(Number(process.env.PORT??3100),'127.0.0.1',()=>console.log('Synthetic API ready'));
}
