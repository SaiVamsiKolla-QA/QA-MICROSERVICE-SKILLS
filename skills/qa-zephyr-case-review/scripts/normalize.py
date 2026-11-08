#!/usr/bin/env python3
"""Lossless source retention plus explicit structural normalization; no semantic verdicts."""
import csv, io, json, sys, hashlib
from pathlib import Path

def normalize(path):
    raw = Path(path).read_bytes()
    text = raw.decode('utf-8-sig')
    fields = {'Case ID':'id','Title':'title','Preconditions':'preconditions','Steps':'steps',
              'Test Data':'testData','Expected Result':'expected','Requirement Links':'requirements'}
    if Path(path).suffix.lower() == '.csv':
        reader = csv.DictReader(io.StringIO(text), strict=True)
        if not reader.fieldnames or len(set(reader.fieldnames)) != len(reader.fieldnames):
            raise ValueError('Missing or duplicate CSV headers')
        if 'Case ID' not in reader.fieldnames or any(k not in fields for k in reader.fieldnames):
            raise ValueError('Unsupported CSV headers; explicit mapping required')
        originals = list(reader)
        if any(None in row or any(v is None for v in row.values()) for row in originals):
            raise ValueError('CSV row width differs from headers')
        records = [{fields[k]:v for k,v in row.items()} for row in originals]
    elif Path(path).suffix.lower() == '.json':
        source = json.loads(text)
        if isinstance(source, dict):
            if set(source) != {'testCases'}: raise ValueError('Unsupported or ambiguous JSON envelope')
            source = source['testCases']
        if not isinstance(source,list): raise ValueError('Expected JSON array')
        originals = source
        records = source
    else:
        raise ValueError('Unsupported extension; use documented CSV or JSON')
    if not records: raise ValueError('Empty export')
    seen = set(); cases = []
    for index,(record,original) in enumerate(zip(records,originals),1):
        if not isinstance(record,dict): raise ValueError(f'Record {index}: expected object')
        case_id=record.get('id')
        if not isinstance(case_id,str) or not case_id.strip(): raise ValueError(f'Record {index}: missing string ID')
        if case_id in seen: raise ValueError(f'Duplicate ID: {case_id}')
        seen.add(case_id)
        cases.append({'caseId':case_id,'sourceRecord':index,'original':original,
                      'fields':{k:record.get(k) for k in ['title','preconditions','steps','testData','expected','requirements']}})
    return {'sourceFile':Path(path).name,'sourceSha256':hashlib.sha256(raw).hexdigest(),
            'sourceText':raw.decode('utf-8'),'cases':cases,'unparsedRecords':0}

if __name__ == '__main__':
    try:
        if len(sys.argv)!=3: raise ValueError('Usage: normalize.py INPUT OUTPUT.json')
        src,dst=map(Path,sys.argv[1:])
        if src.resolve()==dst.resolve(): raise ValueError('Output must differ from original')
        result=normalize(src)
        # Exclusive create prevents accidental loss of an existing report or original.
        with dst.open('x',encoding='utf-8') as out: json.dump(result,out,ensure_ascii=False,indent=2)
    except (ValueError,OSError,csv.Error,UnicodeError) as exc:
        print(f'Normalization failed: {exc}',file=sys.stderr);sys.exit(1)
