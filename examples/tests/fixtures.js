import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
export const test=base.extend({
  owned:async({request},use,info)=>{
    const id=`${process.env.RUN_ID??randomUUID()}-${info.parallelIndex}-${info.repeatEachIndex}-${info.retry}-${info.testId.replace(/[^a-zA-Z0-9]/g,'')}`;
    const payload={id,quantity:2,unitPriceCents:125};
    await info.attach('data-recipe',{body:JSON.stringify(payload),contentType:'application/json'});
    const headers={Authorization:'Bearer alice-test'};
    try {await use({id,payload,headers});}
    finally {
      const del=await request.delete(`/orders/${id}`,{headers});
      expect([200,404],`cleanup ${id}`).toContain(del.status());
      expect((await request.get(`/orders/${id}`,{headers})).status(),`absence after cleanup ${id}`).toBe(404);
    }
  }
});
export {expect};
export async function capture(info,label,response) {
  await info.attach(label,{body:JSON.stringify({url:response.url(),status:response.status(),headers:response.headers(),body:await response.text()}),contentType:'application/json'});
}
export function shape(body) {
  for(const [key,type] of Object.entries({id:'string',owner:'string',quantity:'number',unitPriceCents:'number',totalCents:'number'}))expect(typeof body[key],`required field ${key}`).toBe(type);
  for(const key of ['quantity','unitPriceCents','totalCents'])expect(Number.isInteger(body[key]),`integer ${key}`).toBe(true);
}
