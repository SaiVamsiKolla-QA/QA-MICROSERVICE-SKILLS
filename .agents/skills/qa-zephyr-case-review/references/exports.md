# Tested export structures
Python 3 standard library only. Run from this skill folder:
`python3 scripts/normalize.py exported.csv normalized.json`

Supported: UTF-8/BOM CSV with headers `Case ID,Title,Preconditions,Steps,Test Data,Expected Result,Requirement Links`; RFC-style quoted commas/newlines. One row per case. JSON array of case objects, or `{ "testCases": [...] }`, using `id,title,preconditions,steps,testData,expected,requirements`. All fields except ID may be absent and are reviewed as missing. IDs must be nonempty strings and unique. Original records and full original text (including unknown fields) are retained; normalization never edits the source. Requirements remain strings/lists as supplied.

Synthetic fixtures test these structures only. Native Zephyr XLSX, XML, HTML, custom columns and repeated rows per step are unsupported. Do not claim universal Zephyr export compatibility. Map custom headers explicitly in a new reviewed adapter and test preservation before using it. Empty exports, malformed CSV/JSON, duplicate IDs, ambiguous envelopes and non-object rows fail closed.
