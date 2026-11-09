# Optional Zephyr retrieval

Offline exported CSV/JSON remains the default. Review the edition, region, project key and API contract before connecting. Cloud v2 token support does not imply Server/DC or Essential compatibility.

Normalize supported local exports without overwriting originals:

```sh
python3 .agents/skills/qa-zephyr-case-review/scripts/normalize.py exports/cases.csv normalized-cases.json
```

For an explicitly authorized read-only Cloud REST request, configure ZEPHYR_BASE_URL and ZEPHYR_API_TOKEN outside source control. A typical v2 GET is shown below; use a secure HTTP client/secret binding if command-line arguments are observable in your environment:

```sh
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer ${ZEPHYR_API_TOKEN}" \
  "${ZEPHYR_BASE_URL}/testcases?projectKey=${ZEPHYR_PROJECT_KEY}"
```

ZEPHYR_PROJECT_KEY is a project-specific REST query value, not a standard local MCP environment variable. Handle pagination and preserve case IDs; store exports privately when they contain company data. Publishing executions or editing cases requires explicit authorization.

For MCP, follow [SmartBear's official setup](https://github.com/SmartBear/smartbear-mcp). The remote endpoint supports host OAuth; local package mode uses ZEPHYR_API_TOKEN/ZEPHYR_BASE_URL and may limit products with MCP_CLIENTS=Zephyr. Choose and review the local package version separately; this repository does not install or start it. Check tool availability using the connected host's tool list. Missing live integration does not block file-based review. Live REST/MCP connectivity and write permissions were not exercised here.
