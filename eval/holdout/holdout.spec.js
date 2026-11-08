import {test,expect,shape} from '../../examples/tests/fixtures.js';
test('[HOLD-1] lower boundary has total one cent',async({request,owned})=>{
 const res=await request.post('/orders',{data:{...owned.payload,quantity:1,unitPriceCents:1},headers:owned.headers});expect(res.status()).toBe(201);const body=await res.json();shape(body);expect(body.totalCents).toBe(1);
});
test('[HOLD-2] duplicate preserves original',async({request,owned})=>{
 expect((await request.post('/orders',{data:owned.payload,headers:owned.headers})).status()).toBe(201);
 expect((await request.post('/orders',{data:{...owned.payload,quantity:10},headers:owned.headers})).status()).toBe(409);
 const read=await request.get(`/orders/${owned.id}`,{headers:owned.headers});expect(read.status()).toBe(200);expect(await read.json()).toMatchObject({quantity:2,totalCents:250});
});
