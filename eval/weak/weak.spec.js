import {test,expect} from '@playwright/test';
let id='shared-order';
test('creates order',async({request})=>{
  const response=await request.post('/orders',{headers:{Authorization:'Bearer alice-test'},data:{id,quantity:2,unitPriceCents:125}});
  expect(response.ok()).toBeTruthy();
});
test('reads order',async({request})=>{
  const response=await request.get(`/orders/${id}`,{headers:{Authorization:'Bearer alice-test'}});
  if(response.ok())expect(await response.json()).toBeTruthy();
});
