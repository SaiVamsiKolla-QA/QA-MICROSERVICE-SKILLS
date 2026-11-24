# Bug Hunter

An AI instruction skill for investigating a specific software bug and, when requested, implementing and verifying a focused fix. It is not an executable scanner and does not guarantee that a project is bug-free.

See [SKILL.md](SKILL.md) for its workflow and execution boundaries.

Example requests:

- “Use bug-hunter to diagnose this login timeout. Report the evidence before changing code.”
- “Use bug-hunter to fix duplicate form submissions in this local project and verify a regression test.”

Provide the project location and a symptom or reproduction. The agent should inspect available evidence, preserve existing work, protect sensitive data, and distinguish confirmed results from unverified hypotheses.

This folder alone does not install or activate the skill in an agent. Skill discovery depends on the host application's configured skill locations.
