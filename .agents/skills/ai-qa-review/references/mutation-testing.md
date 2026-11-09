# Optional mutation testing

Use mutation testing when the target source is available and the project supports instrumentation. A black-box API suite against a remote service cannot automatically produce a source mutation score.

Use the project's configured runner and scope. Examples include Stryker for JS/TS, PIT for Java, cargo-mutants for Rust, and mutmut for Python; confirm availability and configuration before running. Do not add dependencies or CI gates as part of a review unless requested.

Establish a healthy baseline, confirm the mutated code was reached, and record detected, surviving, equivalent, timed-out, and untested mutations separately. Choose thresholds from project policy and measured risk. A low score identifies gaps to investigate; it does not prove how tests were authored.

For API suites, controlled service faults in an isolated local environment can demonstrate detection of specific business, schema, auth, or state defects. Report those individual controls rather than calling them a general mutation score.
