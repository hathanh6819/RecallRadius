import test from'node:test';
import assert from'node:assert/strict';
import{latestCaseEpochId}from'./caseEpoch.ts';

test('selected case uses its own latest epoch instead of global epoch count',()=>{
 assert.equal(latestCaseEpochId({epoch_ids:[2,5]}),5);
 assert.notEqual(latestCaseEpochId({epoch_ids:[2,5]}),9);
});

test('multi-case readback keeps each case on its deployed epoch',()=>{
 const first={id:1,epoch_ids:[1,3]};
 const second={id:2,epoch_ids:[2,4,6]};
 assert.equal(latestCaseEpochId(first),3);
 assert.equal(latestCaseEpochId(second),6);
});

test('case without assessments has no epoch readback',()=>{
 assert.equal(latestCaseEpochId({epoch_ids:[]}),0);
 assert.equal(latestCaseEpochId(null),0);
});
