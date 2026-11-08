// Evidence collector, not an automatic triage classifier.
import {createService} from '../examples/service/server.mjs';
import fs from 'node:fs';
const records=[];
for(const fault of ['healthy','content','schema','authorization','state']){
 const {server}=createService(fault);await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}`;const payload={id:'triage-example',quantity:2,unitPriceCents:125};
 const capture=async(method,url,principal,data)=>{const response=await fetch(base+url,{method,headers:{Authorization:`Bearer ${principal}-test`,'content-type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});return {method,path:url,principal,requestBody:data??null,status:response.status,body:await response.json()};};
 try{
  const create=await capture('POST','/orders','alice',payload);
  const read=await capture('GET','/orders/triage-example',fault==='authorization'?'bob':'alice');
  const cleanup=await capture('DELETE','/orders/triage-example','alice');
  const inventory=await(await fetch(base+'/__inventory')).json();const events=await(await fetch(base+'/__events')).json();
  records.push({scenario:fault,create,read,cleanup,inventory,events});
 }finally{await new Promise(resolve=>server.close(resolve));}
}
// Healthy response against an intentionally incorrect test oracle, and a real closed-port error.
const healthy=records[0];records.push({scenario:'automation-oracle-control',observed:healthy.create.body.totalCents,incorrectTestExpected:200,requirementExpected:250});
const {server}=createService();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;await new Promise(resolve=>server.close(resolve));
try{await fetch(`http://127.0.0.1:${port}/health`);throw Error('Closed-port control unexpectedly reachable');}catch(error){if(error.message==='Closed-port control unexpectedly reachable')throw error;records.push({scenario:'environment-closed-port-control',httpResponseReceived:false,error:error.message,cause:error.cause?.code});}
fs.writeFileSync('eval/results/triage-controls.json',JSON.stringify(records,null,2)+'\n');console.log(`Captured ${records.length} triage evidence controls`);
