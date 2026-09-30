import test from'node:test';import assert from'node:assert/strict';import{chain,wallet}from'./genlayer.ts';
test('Studio Next chain is pinned',()=>assert.equal(chain.id,61997));
test('wallet rejects wrong chain',async()=>await assert.rejects(()=>wallet({request:async({method}:any)=>method==='eth_requestAccounts'?['0x1111111111111111111111111111111111111111']:'0x1'}),/61997/));
test('wallet rejects account drift',async()=>await assert.rejects(()=>wallet({request:async({method}:any)=>method==='eth_requestAccounts'?['0x2222222222222222222222222222222222222222']:'0xf22d'},'0x1111111111111111111111111111111111111111'),/changed/));
