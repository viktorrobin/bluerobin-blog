# Editorial Review — 2026-08-02

Full relevance audit of all 125 files in `src/content/blog/` against the current
platform state (prod-only cluster per ADR-034, R2 + envelope encryption per
ADR-006, Grafana LGTM stack, digest-pin GitOps per ADR-027). Follows the
2026-02-26 review. Remediation policy for this pass: **dated addendum notes
only** — original article text untouched; whole-article staleness uses the house
`deprecated: true` banner, localized staleness gets an inline dated `<Callout>`.

## A. Stale-as-current — remediated this pass (14 articles)

| Article | Stale claim | Action |
|---|---|---|
| `workflow-automation-n8n-kubernetes` | n8n as current automation glue | `deprecated: true` banner |
| `homelab-dashboarding-homepage-backstage` | Backstage as current dev portal | `deprecated: true` banner |
| `remote-vscode-dev-setup-kubernetes-devcontainer` | in-cluster dev container as current workflow | `deprecated: true` banner (ADR-034) |
| `bluerobin-features-document-archives-ocr` | MinIO + KES as live product storage | dated Callout (→ R2 + envelope encryption, ADR-006) |
| `kubernetes-cluster-setup-for-agentic-ai-workloads` | staging namespaces, SigNoz, MinIO in topology | dated Callout |
| `kustomize-overlays-multi-environment` | staging overlays + SigNoz endpoints as current | dated Callout |
| `external-secrets-infisical-kubernetes` | MinIO credentials + staging scoping | dated Callout |
| `dotnet-health-checks-kubernetes` | `MinioHealthCheck` as current infra check | dated Callout |
| `microservices-benchmarking-and-stress-testing` | "our SigNoz dashboards" | dated Callout |
| `graphrag-gitops-kustomize-externalsecrets` | staging→prod promotion path as current | dated Callout |
| `gitops-flux-cd-introduction` | Keel `:latest` polling in staging | dated Callout (ADR-027/034) |
| `telegram-miniapp-blazor-integration` | `web-staging.bluerobin.local` URL | dated Callout |
| `opentelemetry-instrumentation-dotnet` | SigNoz implied as chosen backend | dated Callout (→ LGTM) |
| `github-actions-cicd-dotnet` | `staging` dispatch target | dated Callout |

All 14 got `updatedDate: 2026-08-02`.

## B. Already correctly deprecated — no action (9)

`minio-object-storage-document-management`, `minio-kubernetes-multi-tenant`,
`telegram-integration-architecture-diagrams`, `telegram-bot-kubernetes-deployment`,
`telegram-nats-notification-flow`, `longhorn-distributed-storage-kubernetes`,
`ravendb-experience-challenges-and-benefits`, `semantic-kernel-agents-orchestration`,
`ai-strategy-moving-local-llama-to-openai`.

## C. Minor / borderline — noted, deliberately not edited

- `postgresql-kubernetes-cnpg` — already carries an inline ADR-034 disclaimer; the dual-DB teaching example is fine below it.
- `qdrant-kubernetes-vector-search` — "3-node StatefulSet for HA" is a Qdrant replica design choice, but reads awkwardly against the 2-node cluster; revisit if the article is ever refreshed.
- `homelab-setup-truenas-server-guide` + `architecture-decision-cloud-to-homelab` — cross-link the (now-deprecated) n8n article; acceptable since the target carries the banner.
- `telegram-bot-integration-dotnet-guide` — n8n comparison is historical framing; `staging.archives.alerts.>` subject example is illustrative.
- `local-development-setup-guide` — suggests a `devcontainer.json` for contributors; harmless as a generic suggestion, but candidates for cleanup in a future pass.

## D. Broken links — fixed this pass

Two articles linked to a never-published slug `/observability-lessons-why-we-dropped-signoz`
(`telegram-bot-integration-dotnet-guide`, `homelab-setup-truenas-server-guide`).
Repointed to `/articles/opentelemetry-instrumentation-dotnet`. The missing
article is a real content gap — see suggestion #1 below.

## E. Verified current — no action

The 2026-06 Debug Agent Papers and 2026-06/07 leadership essays reflect the
current platform (CX43 + LAN node, R2, LGTM, AI Gateway, prod-only).

---

## New-article suggestions (from May–Aug 2026 platform work)

Excluded by editorial decision: anything deaddrop/SimpleX/calculator-adjacent,
including the Signal workstation deployment.

### Tier 1 — strongest war stories / novelty

1. **"Why We Dropped SigNoz: the LGTM Migration"** — fills the dangling-link gap above; the only major platform migration with zero blog coverage.
2. **"We Dark-Launched a SaaS OCR and Rolled It Back in 24 Hours"** — Reducto: feature-flag dark launch, V3 config migration, credit burn, same-day revert (FEAT-004, COST-7).
3. **"Stopping Our RAG Eval From Lying to Us"** — golden-set v2, no-answer probes, faithfulness vs golden judges, drift detection; TRUE grounded score dropped from 0.885 to 0.408 (FEAT-004).
4. **"HyDE Looked Great in the Demo and Hurt Us in Prod"** — honest negative A/B result on a popular RAG technique.
5. **"A Code-Aware Stack Graph in FalkorDB"** — joining OTel spans ↔ methods ↔ NATS seams ↔ k8s topology for RCA (FEAT-027).
6. **"When Your Own MITM Breaks Everything"** — Cloudflare Gateway TLS-inspection x509 saga across Velero, Alertmanager, DNS, R2.
7. **"BlueCoin v2: NFC, Savings and Interest for a Kids' Allowance System"** — domain modeling + request signing + interest idempotency (FEAT-029).

### Tier 2 — solid engineering deep-dives

8. Casework: a parallel RCA cockpit with live SSE reasoning streams (FEAT-028).
9. Grounding an LLM RCA loop: BARO blend, hypothesis trees, verification gates.
10. Cost-safe autonomous RCA: trigger funnels, cooldowns, daily LLM caps.
11. Egress governance at the NetworkPolicy layer (ADR-032).
12. Family sharing without leaking: a server-resolved FamilyScope choke point (FEAT-014, ADR-063).
13. Per-user AI cost capture and monthly token budgets (FEAT-013).
14. Cost-safe synthetic documents: markers + LLM-reachability probes (ADR-043).

### Tier 3 — good supporting posts

Passkey-first passwordless MFA with Authelia (ADR-061) · NATS token-auth
hardening + zombie durables · prod-only staging collapse retrospective (ADR-034)
· CF AI Gateway route consolidation 19→5 (ADR-050) · DR drills on a scratch
restore cluster (BAK-18) · pipeline reconciler for stuck documents (FEAT-030) ·
reranker calibration + funnel widening · propose-only fuzzy entity dedup ·
image-staleness probe with auto-remediation · Alloy SIGSEGV span-metrics hybrid
(ADR-062) · cloudflared on-prem primary origin (ADR-048) · code-index embeddings
on CF Workers AI.
