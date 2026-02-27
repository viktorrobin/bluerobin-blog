#!/usr/bin/env python3
"""
Update blog article dates to spread them over 2 years (Feb 2024 - Feb 2026).
Also marks stub articles as draft: true.
"""

import re
import os

BLOG_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'blog')
COOKBOOK_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'cookbook')
ARCH_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'architecture')

# === DATE MAPPING ===
# Maps filename (without .mdx) -> new pubDate
# Organized by project evolution phase

DATE_MAP = {
    # Phase 1 — Foundation (Feb-Apr 2024)
    "homelab-setup-truenas-server-guide": "2024-02-15",
    "securing-homelab-subnetting-firewall-hardening": "2024-02-28",
    "networking-setup-tailscale-homelab": "2024-03-08",
    "k3s-home-server-setup": "2024-03-18",  # cookbook
    "architecture-decision-cloud-to-homelab": "2024-03-28",
    "infrastructure-performance-ssd-vs-nas": "2024-04-08",

    # Phase 2 — Core Infrastructure (Apr-Jul 2024)
    "metallb-load-balancer-bare-metal": "2024-04-18",
    "traefik-ingress-kubernetes": "2024-04-28",
    "cert-manager-tls-kubernetes": "2024-05-08",
    "postgresql-kubernetes-cnpg": "2024-05-18",  # cookbook
    "longhorn-distributed-storage-kubernetes": "2024-05-28",
    "gitops-flux-cd-introduction": "2024-06-07",
    "kustomize-overlays-multi-environment": "2024-06-17",
    "github-actions-cicd-dotnet": "2024-06-27",
    "infisical-kubernetes-secrets": "2024-07-07",  # cookbook
    "external-secrets-infisical-kubernetes": "2024-07-17",
    "bluerobin-system-overview": "2024-07-25",  # architecture

    # Phase 3 — Security & Identity (Aug-Oct 2024)
    "zero-trust-architecture-mtls-tokens-identity": "2024-08-05",
    "postgresql-security-design-high-assurance": "2024-08-15",
    "building-private-pki-root-ca-certificates": "2024-08-25",
    "hardened-security-yubikey-certificate-signing": "2024-09-04",
    "authelia-sso-oidc-dotnet": "2024-09-14",
    "kubernetes-network-policies-zero-trust": "2024-09-24",
    "kubernetes-rbac-service-accounts": "2024-10-04",
    "cloudflare-tunnel-secure-service-exposure": "2024-10-14",
    "container-security-best-practices-dotnet": "2024-10-24",

    # Phase 4 — Application Architecture (Oct 2024-Jan 2025)
    "ddd-shared-kernel-implementation-dotnet": "2024-10-30",
    "ddd-factory-methods-private-constructors": "2024-11-06",
    "ddd-value-objects-csharp": "2024-11-13",
    "ddd-aggregates-consistency-boundaries": "2024-11-20",
    "ddd-domain-events-csharp": "2024-11-27",
    "ddd-repository-pattern-efcore": "2024-12-04",
    "fastendpoints-api-development": "2024-12-11",
    "better-ids-switching-uuid-to-nanoid": "2024-12-18",
    "domain-driven-design-practical-end-to-end-guide": "2024-12-25",
    "efcore-migrations-schema-management": "2025-01-02",
    "architecture-pattern-cqrs-implementation-dotnet": "2025-01-09",
    "architecture-pattern-outbox-messaging-reliability": "2025-01-16",
    "architecture-pattern-strangler-fig-migration": "2025-01-23",

    # Phase 5 — Backend Patterns & Blazor (Jan-May 2025)
    "error-handling-resilience-patterns-dotnet": "2025-01-30",
    "dotnet-caching-strategies-redis": "2025-02-06",
    "architecture-pattern-caching-invalidation-strategies": "2025-02-13",
    "architecture-pattern-concurrency-control-dotnet": "2025-02-20",
    "dotnet-background-job-processing": "2025-02-27",
    "dotnet-health-checks-kubernetes": "2025-03-06",
    "integration-testing-dotnet-testcontainers": "2025-03-13",
    "pact-consumer-driven-contract-testing": "2025-03-20",
    "blazor-ui-tailwind-v4-integration": "2025-03-27",
    "blazor-glass-ui-components": "2025-04-03",
    "authelia-oidc-blazor-authentication": "2025-04-10",
    "blazor-forms-validation-state": "2025-04-17",
    "blazor-js-interop-practical-guide": "2025-04-24",
    "blazor-advanced-patterns-lifecycle": "2025-05-01",
    "implementing-glassmorphism-design-system": "2025-05-08",
    "mermaid-diagrams-technical-documentation": "2025-05-15",

    # Phase 6 — Messaging & Real-Time (May-Jul 2025)
    "nats-introduction-jetstream-dotnet": "2025-05-22",
    "nats-jetstream-consumer-patterns": "2025-05-29",
    "nats-advanced-patterns-kv-objectstore": "2025-06-05",
    "nats-monitoring-prometheus-grafana": "2025-06-12",
    "blazor-real-time-nats-updates": "2025-06-19",
    "opentelemetry-instrumentation-dotnet": "2025-06-26",
    "minio-kubernetes-multi-tenant": "2025-07-03",
    "minio-object-storage-document-management": "2025-07-10",
    "nats-kv-idempotent-workers-cas": "2025-07-17",
    "nats-event-contract-migration-strategy": "2025-07-24",
    "distributed-rate-limiting-nats-kv": "2025-07-31",

    # Phase 7 — AI & Document Processing (Aug-Nov 2025)
    "docling-ocr-dotnet-integration": "2025-08-07",
    "text-chunking-strategies-rag": "2025-08-14",
    "embedding-pipeline-ollama-qdrant": "2025-08-21",
    "qdrant-kubernetes-vector-search": "2025-08-28",
    "hybrid-search-semantic-keyword": "2025-09-04",
    "rag-pipeline-ollama-qdrant": "2025-09-11",
    "improving-rag-query-quality-and-relevance": "2025-09-18",
    "spacy-ner-document-analysis": "2025-09-25",
    "falkordb-graph-database-knowledge-graph": "2025-10-02",
    "entity-analysis-and-modeling-graph-database": "2025-10-09",
    "semantic-kernel-agents-orchestration": "2025-10-16",
    "latency-revolution-optimizing-60s-to-3s": "2025-10-23",
    "agentic-rrf-ensembling-production-search": "2025-10-30",
    "ensemble-ner-spacy-llm-voting": "2025-11-06",

    # Phase 8 — Advanced Features & Polish (Nov 2025-Feb 2026)
    "telegram-bot-integration-dotnet-guide": "2025-11-13",
    "telegram-miniapp-blazor-integration": "2025-11-20",
    "telegram-nats-notification-flow": "2025-11-27",
    "telegram-bot-kubernetes-deployment": "2025-12-04",
    "telegram-integration-architecture-diagrams": "2025-12-11",
    "workflow-automation-n8n-kubernetes": "2025-12-18",
    "homelab-dashboarding-homepage-backstage": "2025-12-25",
    "ai-strategy-moving-local-llama-to-openai": "2026-01-01",
    "graphrag-gitops-kustomize-externalsecrets": "2026-01-08",
    "graphrag-hybrid-retrieval-falkordb-qdrant": "2026-01-15",
    "graphrag-routing-dotnet-langgraph-fallback": "2026-01-22",
    "langgraph-state-collision-lessons": "2026-01-25",
    "kubernetes-cluster-setup-for-agentic-ai-workloads": "2026-01-29",
    "model-policy-governance-token-usage": "2026-02-01",
    "mcp-server-figma-design-alignment": "2026-02-05",
    "figma-mcp-self-optimizing-design-loop": "2026-02-08",
    "mcp-server-kubernetes-management": "2026-02-12",
    "remote-vscode-dev-setup-kubernetes-devcontainer": "2026-02-15",
    "cloudflare-workers-edge-computing-limitations": "2026-02-18",
    "ravendb-experience-challenges-and-benefits": "2026-02-21",
    "microservices-benchmarking-and-stress-testing": "2026-02-24",
    "kubernetes-image-optimization-small-pods": "2026-02-26",
    "local-development-setup-guide": "2026-02-27",
}

# Articles that should be marked as draft (stubs needing complete rewrite)
STUBS_TO_DRAFT = {
    "agentic-rrf-ensembling-production-search",
    "ensemble-ner-spacy-llm-voting",
    "graphrag-gitops-kustomize-externalsecrets",
    "graphrag-hybrid-retrieval-falkordb-qdrant",
    "graphrag-routing-dotnet-langgraph-fallback",
    "model-policy-governance-token-usage",
    "distributed-rate-limiting-nats-kv",
    "nats-event-contract-migration-strategy",
    "nats-kv-idempotent-workers-cas",
    "kubernetes-cluster-setup-for-agentic-ai-workloads",
    "remote-vscode-dev-setup-kubernetes-devcontainer",
    "langgraph-state-collision-lessons",
}


def update_file(filepath, filename_key):
    """Update pubDate, remove future updatedDate, optionally add draft: true."""
    with open(filepath, 'r') as f:
        content = f.read()

    new_date = DATE_MAP.get(filename_key)
    if not new_date:
        print(f"  SKIP (no mapping): {filename_key}")
        return False

    original = content

    # Update pubDate
    content = re.sub(
        r'^(pubDate:\s*)(\d{4}-\d{2}-\d{2})',
        rf'\g<1>{new_date}',
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # Remove updatedDate lines that are in the future (after 2026-02-27)
    # or just remove all updatedDate since we're resetting the timeline
    content = re.sub(
        r'^updatedDate:\s*\d{4}-\d{2}-\d{2}\s*\n',
        '',
        content,
        flags=re.MULTILINE,
    )

    # Add draft: true for stub articles (if not already present)
    if filename_key in STUBS_TO_DRAFT:
        if 'draft:' not in content:
            # Insert draft: true after the toc line or before the closing ---
            content = re.sub(
                r'^(toc:\s*true)\s*$',
                r'\1\ndraft: true',
                content,
                count=1,
                flags=re.MULTILINE,
            )
            # If toc wasn't found, insert before closing ---
            if 'draft: true' not in content:
                # Find the closing --- of frontmatter
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    content = f'---{parts[1]}draft: true\n---{parts[2]}'

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        status = "DRAFT" if filename_key in STUBS_TO_DRAFT else "OK"
        print(f"  ✅ {filename_key}: {new_date} [{status}]")
        return True
    else:
        print(f"  ⏭️  {filename_key}: no changes needed")
        return False


def process_directory(directory, label):
    """Process all .mdx files in a directory."""
    print(f"\n{'='*60}")
    print(f"Processing {label}: {directory}")
    print(f"{'='*60}")

    count = 0
    skipped = 0

    if not os.path.isdir(directory):
        print(f"  Directory not found: {directory}")
        return 0, 0

    for filename in sorted(os.listdir(directory)):
        if not filename.endswith('.mdx'):
            continue
        key = filename.replace('.mdx', '')
        filepath = os.path.join(directory, filename)
        if update_file(filepath, key):
            count += 1
        else:
            skipped += 1

    return count, skipped


def main():
    print("🗓️  Blog Date Redistribution Script")
    print("=" * 60)

    total_updated = 0
    total_skipped = 0

    for directory, label in [
        (BLOG_DIR, "Blog Articles"),
        (COOKBOOK_DIR, "Cookbook Articles"),
        (ARCH_DIR, "Architecture Articles"),
    ]:
        updated, skipped = process_directory(os.path.abspath(directory), label)
        total_updated += updated
        total_skipped += skipped

    print(f"\n{'='*60}")
    print(f"DONE: {total_updated} files updated, {total_skipped} skipped")
    print(f"{'='*60}")

    # Verify no future dates remain
    print("\n🔍 Checking for remaining future dates (after 2026-02-27)...")
    future_count = 0
    for directory in [BLOG_DIR, COOKBOOK_DIR, ARCH_DIR]:
        directory = os.path.abspath(directory)
        if not os.path.isdir(directory):
            continue
        for filename in sorted(os.listdir(directory)):
            if not filename.endswith('.mdx'):
                continue
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            dates = re.findall(r'pubDate:\s*(\d{4}-\d{2}-\d{2})', content)
            for d in dates:
                if d > "2026-02-27":
                    print(f"  ⚠️  FUTURE DATE: {filename} has pubDate: {d}")
                    future_count += 1
            updated_dates = re.findall(r'updatedDate:\s*(\d{4}-\d{2}-\d{2})', content)
            for d in updated_dates:
                if d > "2026-02-27":
                    print(f"  ⚠️  FUTURE updatedDate: {filename} has {d}")
                    future_count += 1

    if future_count == 0:
        print("  ✅ No future dates found!")
    else:
        print(f"  ⚠️  {future_count} future dates remaining")


if __name__ == "__main__":
    main()
