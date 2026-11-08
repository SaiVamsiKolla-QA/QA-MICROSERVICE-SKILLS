import {test,expect,capture,shape} from './fixtures.js';
test('[ZEP-1] create returns documented body and total',async({request,owned},info)=>{
  const response=await request.post('/orders',{data:owned.payload,headers:owned.headers});await capture(info,'create',response);
  expect(response.status()).toBe(201);expect(response.headers()['content-type']).toContain('application/json');
  const body=await response.json();shape(body);
  expect(body).toMatchObject({...owned.payload,owner:'alice',totalCents:250});
});
test('[ZEP-2] created state is independently readable',async({request,owned},info)=>{
  expect((await request.post('/orders',{data:owned.payload,headers:owned.headers})).status()).toBe(201);
  const response=await request.get(`/orders/${owned.id}`,{headers:owned.headers});await capture(info,'read-back',response);
  expect(response.status()).toBe(200);const body=await response.json();shape(body);expect(body).toMatchObject({...owned.payload,owner:'alice',totalCents:250});
});
test('[ZEP-3] foreign read and delete are forbidden without mutation',async({request,owned},info)=>{
  expect((await request.post('/orders',{data:owned.payload,headers:owned.headers})).status()).toBe(201);
  const headers={Authorization:'Bearer bob-test'};
  const read=await request.get(`/orders/${owned.id}`,{headers});await capture(info,'foreign-read',read);
  const del=await request.delete(`/orders/${owned.id}`,{headers});await capture(info,'foreign-delete',del);
  expect.soft(read.status()).toBe(403);expect.soft(await read.json()).toEqual({error:'forbidden'});
  expect.soft(del.status()).toBe(403);
  const after=await request.get(`/orders/${owned.id}`,{headers:owned.headers});expect(after.status()).toBe(200);expect((await after.json()).totalCents).toBe(250);
});
test('[ZEP-4] anonymous create is rejected and leaves no state',async({request,owned},info)=>{
  const response=await request.post('/orders',{data:owned.payload});await capture(info,'anonymous',response);
  expect(response.status()).toBe(401);expect(await response.json()).toEqual({error:'unauthorized'});
  expect((await request.get(`/orders/${owned.id}`,{headers:owned.headers})).status()).toBe(404);
});
for(const quantity of [0,11])test(`[ZEP-5] quantity ${quantity} rejected`,async({request,owned})=>{
  const res=await request.post('/orders',{data:{...owned.payload,quantity},headers:owned.headers});expect(res.status()).toBe(422);expect(await res.json()).toEqual({error:'invalid input'});
  expect((await request.get(`/orders/${owned.id}`,{headers:owned.headers})).status()).toBe(404);
});
test('[ZEP-6] delete removes owned resource',async({request,owned})=>{
  expect((await request.post('/orders',{data:owned.payload,headers:owned.headers})).status()).toBe(201);
  expect((await request.get(`/orders/${owned.id}`,{headers:owned.headers})).status()).toBe(200);
  const del=await request.delete(`/orders/${owned.id}`,{headers:owned.headers});expect(del.status()).toBe(200);expect(await del.json()).toEqual({deleted:true});
  expect((await request.get(`/orders/${owned.id}`,{headers:owned.headers})).status()).toBe(404);
});
