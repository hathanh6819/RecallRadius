#!/usr/bin/env node
import{createAccount,createClient}from'../frontend/node_modules/genlayer-js/dist/index.js';
import{studioDevnet}from'../frontend/node_modules/genlayer-js/dist/chains/index.js';

const CONTRACT='0xDAD201Cde0623C1e1BC1FFe87795f5ef7140A96f';
const EXPECTED_AUTHOR='0x1D283b45974B0be9630DFD1deC6A62a9B72B2760';
const EXPECTED_OBSERVER='0xf96Cf822F9f4e76956AB9fAAa22B3BdCD7b10aD6';
const chain={...studioDevnet,id:61997,name:'Studio Next',rpcUrls:{default:{http:['https://studio-next.genlayer.com/api']}}};

function hidden(prompt){return new Promise((resolve,reject)=>{process.stdout.write(prompt);process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');let value='';const done=()=>{process.stdin.off('data',onData);process.stdin.setRawMode(false);process.stdin.pause()};const onData=chunk=>{for(const ch of chunk){if(ch==='\u0003'){done();reject(Error('Interrupted'));return}if(ch==='\r'||ch==='\n'){done();process.stdout.write('\n');resolve(value.trim());return}if(ch==='\u007f'||ch==='\b')value=value.slice(0,-1);else value+=ch}};process.stdin.on('data',onData)})}
async function signer(label){const key=await hidden(`${label} private key (hidden input): `),account=createAccount(key.startsWith('0x')?key:`0x${key}`);return{account,client:createClient({chain,account})}}
const author=await signer('author test wallet'),observer=await signer('observer test wallet');
if(author.account.address.toLowerCase()!==EXPECTED_AUTHOR.toLowerCase()||observer.account.address.toLowerCase()!==EXPECTED_OBSERVER.toLowerCase())throw Error('Wallet mismatch; no transaction sent.');
const read=(s,name,args=[])=>s.client.readContract({address:CONTRACT,functionName:name,args,stateStatus:'finalized',jsonSafeReturn:true});
async function write(s,label,name,args,validators=300n){const fees=await s.client.estimateTransactionFees({leaderTimeunitsAllocation:300n,validatorTimeunitsAllocation:validators});const hash=await s.client.writeContract({account:s.account,address:CONTRACT,functionName:name,args,value:0n,fees:{distribution:fees.distribution,feeValue:fees.feeValue}});console.log(`${label}.submitted=${hash}`);const receipt=await s.client.waitForTransactionReceipt({hash,waitUntil:'finalized',interval:3000,retries:600,fullTransaction:false});const tx=await s.client.getTransaction({hash});const consensus=tx.result_name||tx.result||'UNKNOWN';if(receipt?.txExecutionResultName&&receipt.txExecutionResultName!=='FINISHED_WITH_RETURN')throw Error(`${label} execution=${receipt.txExecutionResultName}`);if(String(consensus).includes('DISAGREE'))throw Error(`${label} consensus=${consensus}`);console.log(`${label}.finalized=${hash} execution=${receipt?.txExecutionResultName||'unknown'} consensus=${consensus}`);return hash}
const check=(ok,label,data)=>{if(!ok)throw Error(`${label}: ${JSON.stringify(data)}`);console.log(`${label}.readback=${JSON.stringify(data)}`)};

const protocol=await read(author,'get_protocol'),initial=await read(author,'get_counts');
check(protocol.version===2&&Number(protocol.chain_id)===61997,'v2 protocol',protocol);
check(Number(initial.cases)===0&&Number(initial.items)===0&&Number(initial.epochs)===0,'clean deployment',initial);

// Two cases are deliberately assessed in interleaved order: case 1, case 2, case 1.
await write(author,'create_case_1','create_case',['GreenWise primary batch']);
await write(author,'case_1_positive','register_item',[1,'GreenWise','41415-06453','ANYLOT','2028-02-09','FL']);
await write(observer,'case_1_control','register_item',[1,'Other Brand','999999999999','SAFE77','2028-02-09','FL']);
await write(author,'seal_case_1','seal_case',[1]);
await write(author,'create_case_2','create_case',['Great Value comparison batch']);
await write(author,'case_2_positive','register_item',[2,'Great Value','078742370552','6040 01-6','2028-02-09','IA']);
await write(observer,'case_2_control','register_item',[2,'Great Value','078742370552','WRONG','2028-02-09','IA']);
await write(author,'seal_case_2','seal_case',[2]);

let c1=await read(author,'get_case',[1]),c2=await read(author,'get_case',[2]);
await write(observer,'assess_case_1_epoch_1','assess_epoch',[1,Number(c1.revision)],600n);
c2=await read(author,'get_case',[2]);await write(observer,'assess_case_2_epoch_2','assess_epoch',[2,Number(c2.revision)],600n);
c1=await read(author,'get_case',[1]);await write(observer,'assess_case_1_epoch_3','assess_epoch',[1,Number(c1.revision)],600n);

c1=await read(author,'get_case',[1]);c2=await read(author,'get_case',[2]);
const e1=await read(author,'get_epoch',[1]),e2=await read(author,'get_epoch',[2]),e3=await read(author,'get_epoch',[3]);
const items=await Promise.all([1,2,3,4].map(id=>read(author,'get_item',[id]))),counts=await read(author,'get_counts');
check(JSON.stringify(c1.epoch_ids)==='[1,3]'&&JSON.stringify(c2.epoch_ids)==='[2]','case-scoped epoch indexes',{case1:c1.epoch_ids,case2:c2.epoch_ids});
check(Number(e1.case_id)===1&&Number(e2.case_id)===2&&Number(e3.case_id)===1,'interleaved epoch ownership',{e1:e1.case_id,e2:e2.case_id,e3:e3.case_id});
check(e1.status==='NORMALIZED'&&e2.status==='NORMALIZED'&&e3.status==='NORMALIZED','successful source epochs',{e1:e1.status,e2:e2.status,e3:e3.status});
check(e1.scope_transition==='INITIAL'&&e2.scope_transition==='INITIAL'&&e3.scope_transition==='UNCHANGED','scope transitions',{e1:e1.scope_transition,e2:e2.scope_transition,e3:e3.scope_transition});
check(c1.last_scope_digest===e3.scope_digest&&e3.prior_valid_scope_digest===e1.scope_digest,'last-valid digest readback',{caseDigest:c1.last_scope_digest,e1:e1.scope_digest,e3Prior:e3.prior_valid_scope_digest,e3:e3.scope_digest});
check(items[0].status==='AFFECTED'&&items[1].status==='NOT_AFFECTED'&&items[2].status==='AFFECTED'&&items[3].status==='NOT_AFFECTED','deterministic classifications',items.map(x=>({id:x.id,status:x.status,reason:x.reason,last_epoch_id:x.last_epoch_id})));
check(Number(counts.cases)===2&&Number(counts.items)===4&&Number(counts.epochs)===3,'final counts',counts);
console.log(`e2e.final.case1=${JSON.stringify(c1)}`);console.log(`e2e.final.case2=${JSON.stringify(c2)}`);console.log(`e2e.final.epoch1=${JSON.stringify(e1)}`);console.log(`e2e.final.epoch2=${JSON.stringify(e2)}`);console.log(`e2e.final.epoch3=${JSON.stringify(e3)}`);console.log(`e2e.final.items=${JSON.stringify(items)}`);console.log(`e2e.final.counts=${JSON.stringify(counts)}`);console.log('e2e.result=PASS');
