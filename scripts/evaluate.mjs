import {createService} from '../examples/service/server.mjs';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
const output=path.resolve('eval/results');fs.mkdirSync(output,{recursive:true});
const matrix=[];
for(const suite of ['development','holdout','weak'])for(const fault of ['healthy','content','schema','authorization','state']) {
 const {server}=createService(fault);await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const baseURL=`http://127.0.0.1:${server.address().port}`;
 const name=`${suite}-${fault}`,report=path.join(output,`${name}.json`),runId=randomUUID();
 try {
  const args=['node_modules/@playwright/test/cli.js','test',...(suite==='development'?[]:['--config=eval/playwright.config.js']),'--workers=4',...(fault==='healthy'?['--repeat-each=3']:[])];
  const child=spawn(process.execPath,args,{env:{...process.env,API_BASE_URL:baseURL,REPORT_FILE:report,FAULT:fault,EVAL_SUITE:suite,RUN_ID:runId},stdio:['ignore','pipe','pipe']});
  let log='';child.stdout.on('data',x=>log+=x);child.stderr.on('data',x=>log+=x);
  const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',resolve);});fs.writeFileSync(path.join(output,`${name}.log`),log);
  if(!fs.existsSync(report))throw Error(`No report: ${name}`);
  const result=JSON.parse(fs.readFileSync(report));const failures=[];
  function visit(s){for(const spec of s.specs??[])for(const t of spec.tests??[])if(t.status!=='expected')failures.push({title:spec.title,status:t.status,errors:t.results.flatMap(r=>(r.errors??[]).map(e=>e.message))});for(const c of s.suites??[])visit(c);}visit(result);
  const inventory=await(await fetch(`${baseURL}/__inventory`)).json();
  const events=await(await fetch(`${baseURL}/__events`)).json();
  fs.writeFileSync(path.join(output,`${name}-service.json`),JSON.stringify({inventory,events},null,2));
  const entry={suite,fault,command:`node ${args.join(' ')}`,runId,exitCode:code,stats:result.stats,failures,remainingResources:inventory.ids};matrix.push(entry);
  console.log(`${name}: exit ${code}, passed ${result.stats.expected}, failed ${result.stats.unexpected}, remaining ${inventory.ids.length}`);
  if(result.stats.expected+result.stats.unexpected===0 || (result.errors??[]).length)throw Error(`Incomplete run ${name}`);
  if(suite!=='weak' && (inventory.ids.length || (fault==='healthy' && code!==0) || (suite==='development' && fault!=='healthy' && code===0)))throw Error(`Unexpected control outcome ${name}`);
 }finally{await new Promise(resolve=>server.close(resolve));}
}
fs.writeFileSync(path.join(output,'matrix.json'),JSON.stringify({generatedAt:new Date().toISOString(),node:process.version,matrix},null,2)+'\n');
