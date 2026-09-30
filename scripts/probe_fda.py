"""Read-only reproducibility probe for RecallRadius' exact official FDA source."""
import hashlib,ssl,urllib.request
import certifi
URL="https://www.fda.gov/food/outbreaks-foodborne-illness/outbreak-investigation-e-coli-o145h28-frozen-blueberries-july-2026"
req=urllib.request.Request(URL,headers={"User-Agent":"RecallRadius/1.0 research-contact@example.org","Accept":"text/html"})
with urllib.request.urlopen(req,timeout=30,context=ssl.create_default_context(cafile=certifi.where())) as res:
    body=res.read()
print({"url":URL,"status":res.status,"bytes":len(body),"sha256":hashlib.sha256(body).hexdigest(),"contains_greenwise":b"GreenWise" in body,"contains_great_value":b"Great Value" in body,"contains_lot":b"6040 01-6" in body})
