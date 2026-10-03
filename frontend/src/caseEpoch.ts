export function latestCaseEpochId(dossier:{epoch_ids?:unknown[]}|null|undefined):number{
 const ids=Array.isArray(dossier?.epoch_ids)?dossier.epoch_ids:[];
 const latest=ids.length?Number(ids[ids.length-1]):0;
 return Number.isSafeInteger(latest)&&latest>0?latest:0;
}
