from pathlib import Path
S=Path("contracts/recall_radius.py").read_text(encoding="utf-8")
def test_locked_runner():assert S.splitlines()[0]=="# v0.2.16" and "py-genlayer:1jb45" in S.splitlines()[1]
def test_no_custody_or_constructor_roles():assert "payable" not in S and "emit_transfer" not in S and '"custody":False' in S and "owner:" not in S
def test_source_is_fixed_and_bounded():assert 'SOURCE_URL="https://www.fda.gov/' in S and "MAX_BODY=50000" in S and "source_url:str" not in S
def test_ai_normalizes_but_contract_matches():
    segment=S.split("def assess_epoch",1)[1]
    assert "prompt_comparative" in segment and 'is_green=' in segment and 'is_great=' in segment
def test_append_only_epoch_diagnostics():assert '"scope_transition":transition' in S and '"diagnostics":diagnostics' in S
def test_public_abi_annotations_are_importable():assert "import json,re,hashlib,typing" in S
