#!/usr/bin/env python3
"""
Batch update blog article dates, mark drafts, and genericize code.
Run from bluerobin-blog root: python3 scripts/update-articles.py
"""

import os
import re
import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "src" / "content" / "blog"
COOKBOOK_DIR = Path(__file__).parent.parent / "src" / "content" / "cookbook"
ARCH_DIR = Path(__file__).parent.parent / "src" / "content" / "architecture"

# ============================================================
# STEP 1: Date remapping (filename -> new date)
# ============================================================
DATE_MAP = {
    # Phase 1: Infrastructure Foundation (Feb-May 2024)
    "architecture-decision-cloud-to-homelab.mdx": "2024-02-08",
    "homelab-setup-truenas-server-guide.mdx": "2024-02-18",
    "securing-homelab-subnetting-firewall-hardening.mdx": "2024-02-28",
    "networking-setup-tailscale-homelab.mdx": "2024-03-08",
    "infrastructure-performance-ssd-vs-nas.mdx": "2024-03-18",
    "metallb-load-balancer-bare-metal.mdx": "2024-03-28",
    "traefik-ingress-kubernetes.mdx": "2024-04-07",
    "cert-manager-tls-kubernetes.mdx": "2024-04-17",
    "longhorn-distributed-storage-kubernetes.mdx": "2024-04-27",
    "gitops-flux-cd-introduction.mdx": "2024-05-07",
    "github-actions-cicd-dotnet.mdx": "2024-05-17",
    "kustomize-overlays-multi-environment.mdx": "2024-05-27",

    # Phase 2: Security & Identity (Jun-Sep 2024)
    "external-secrets-infisical-kubernetes.mdx": "2024-06-06",
    "zero-trust-architecture-mtls-tokens-identity.mdx": "2024-06-16",
    "postgresql-security-design-high-assurance.mdx": "2024-06-26",
    "building-private-pki-root-ca-certificates.mdx": "2024-07-06",
    "hardened-security-yubikey-certificate-signing.mdx": "2024-07-16",
    "authelia-sso-oidc-dotnet.mdx": "2024-07-26",
    "kubernetes-network-policies-zero-trust.mdx": "2024-08-05",
    "kubernetes-rbac-service-accounts.mdx": "2024-08-15",
    "cloudflare-tunnel-secure-service-exposure.mdx": "2024-08-25",
    "container-security-best-practices-dotnet.mdx": "2024-09-04",
    "cloudflare-workers-edge-computing-limitations.mdx": "2024-09-11",

    # Phase 3: Backend Architecture / DDD (Sep-Dec 2024)
    "ddd-shared-kernel-implementation-dotnet.mdx": "2024-09-20",
    "ddd-factory-methods-private-constructors.mdx": "2024-09-27",
    "ddd-value-objects-csharp.mdx": "2024-10-04",
    "ddd-aggregates-consistency-boundaries.mdx": "2024-10-11",
    "ddd-domain-events-csharp.mdx": "2024-10-18",
    "ddd-repository-pattern-efcore.mdx": "2024-10-25",
    "fastendpoints-api-development.mdx": "2024-11-03",
    "better-ids-switching-uuid-to-nanoid.mdx": "2024-11-12",
    "domain-driven-design-practical-end-to-end-guide.mdx": "2024-11-22",
    "efcore-migrations-schema-management.mdx": "2024-11-30",
    "architecture-pattern-cqrs-implementation-dotnet.mdx": "2024-12-08",
    "architecture-pattern-outbox-messaging-reliability.mdx": "2024-12-17",
    "architecture-pattern-strangler-fig-migration.mdx": "2024-12-27",

    # Phase 4: Resilience & Messaging (Jan-Mar 2025)
    "error-handling-resilience-patterns-dotnet.mdx": "2025-01-06",
    "dotnet-caching-strategies-redis.mdx": "2025-01-16",
    "architecture-pattern-caching-invalidation-strategies.mdx": "2025-01-26",
    "architecture-pattern-concurrency-control-dotnet.mdx": "2025-02-05",
    "dotnet-background-job-processing.mdx": "2025-02-15",
    "dotnet-health-checks-kubernetes.mdx": "2025-02-25",
    "integration-testing-dotnet-testcontainers.mdx": "2025-03-07",
    "pact-consumer-driven-contract-testing.mdx": "2025-03-15",
    "ravendb-experience-challenges-and-benefits.mdx": "2025-03-24",

    # Phase 5: Frontend & UI (Apr-Jun 2025)
    "blazor-ui-tailwind-v4-integration.mdx": "2025-04-02",
    "blazor-glass-ui-components.mdx": "2025-04-10",
    "authelia-oidc-blazor-authentication.mdx": "2025-04-19",
    "blazor-forms-validation-state.mdx": "2025-04-28",
    "blazor-js-interop-practical-guide.mdx": "2025-05-07",
    "blazor-advanced-patterns-lifecycle.mdx": "2025-05-15",
    "implementing-glassmorphism-design-system.mdx": "2025-05-23",
    "mermaid-diagrams-technical-documentation.mdx": "2025-05-31",
    "remote-vscode-dev-setup-kubernetes-devcontainer.mdx": "2025-06-06",
    "workflow-automation-n8n-kubernetes.mdx": "2025-06-14",

    # Phase 5b: NATS Messaging (Jun-Jul 2025)
    "nats-introduction-jetstream-dotnet.mdx": "2025-06-22",
    "nats-jetstream-consumer-patterns.mdx": "2025-06-29",
    "nats-advanced-patterns-kv-objectstore.mdx": "2025-07-06",
    "nats-monitoring-prometheus-grafana.mdx": "2025-07-14",
    "blazor-real-time-nats-updates.mdx": "2025-07-22",
    "opentelemetry-instrumentation-dotnet.mdx": "2025-07-30",

    # Phase 6: Storage & Advanced Patterns (Aug-Sep 2025)
    "minio-kubernetes-multi-tenant.mdx": "2025-08-07",
    "minio-object-storage-document-management.mdx": "2025-08-15",
    "nats-kv-idempotent-workers-cas.mdx": "2025-08-23",
    "nats-event-contract-migration-strategy.mdx": "2025-08-31",
    "distributed-rate-limiting-nats-kv.mdx": "2025-09-08",
    "kubernetes-cluster-setup-for-agentic-ai-workloads.mdx": "2025-09-15",

    # Phase 7: AI & Document Intelligence (Sep-Dec 2025)
    "docling-ocr-dotnet-integration.mdx": "2025-09-23",
    "text-chunking-strategies-rag.mdx": "2025-09-30",
    "embedding-pipeline-ollama-qdrant.mdx": "2025-10-08",
    "qdrant-kubernetes-vector-search.mdx": "2025-10-16",
    "hybrid-search-semantic-keyword.mdx": "2025-10-24",
    "rag-pipeline-ollama-qdrant.mdx": "2025-10-31",
    "improving-rag-query-quality-and-relevance.mdx": "2025-11-07",
    "spacy-ner-document-analysis.mdx": "2025-11-14",
    "falkordb-graph-database-knowledge-graph.mdx": "2025-11-21",
    "entity-analysis-and-modeling-graph-database.mdx": "2025-11-28",
    "semantic-kernel-agents-orchestration.mdx": "2025-12-05",
    "agentic-rrf-ensembling-production-search.mdx": "2025-12-10",
    "ensemble-ner-spacy-llm-voting.mdx": "2025-12-15",
    "graphrag-hybrid-retrieval-falkordb-qdrant.mdx": "2025-12-20",
    "graphrag-routing-dotnet-langgraph-fallback.mdx": "2025-12-24",
    "langgraph-state-collision-lessons.mdx": "2025-12-28",
    "latency-revolution-optimizing-60s-to-3s.mdx": "2025-12-31",

    # Phase 8: Platform Maturity (Jan-Feb 2026)
    "microservices-benchmarking-and-stress-testing.mdx": "2026-01-05",
    "kubernetes-image-optimization-small-pods.mdx": "2026-01-10",
    "homelab-dashboarding-homepage-backstage.mdx": "2026-01-14",  # draft
    "telegram-bot-integration-dotnet-guide.mdx": "2026-01-18",
    "telegram-miniapp-blazor-integration.mdx": "2026-01-25",
    "telegram-nats-notification-flow.mdx": "2026-01-31",
    "telegram-bot-kubernetes-deployment.mdx": "2026-02-07",
    "telegram-integration-architecture-diagrams.mdx": "2026-02-11",  # draft
    "ai-strategy-moving-local-llama-to-openai.mdx": "2026-02-13",
    "graphrag-gitops-kustomize-externalsecrets.mdx": "2026-02-16",
    "model-policy-governance-token-usage.mdx": "2026-02-18",
    "mcp-server-figma-design-alignment.mdx": "2026-02-21",
    "figma-mcp-self-optimizing-design-loop.mdx": "2026-02-23",  # draft
    "mcp-server-kubernetes-management.mdx": "2026-02-25",
    "local-development-setup-guide.mdx": "2026-02-27",  # draft
}

# Cookbook + architecture dates
EXTRA_DATE_MAP = {
    # (dir, filename) -> new_date
    ("cookbook", "k3s-home-server-setup.mdx"): "2024-03-14",
    ("cookbook", "postgresql-kubernetes-cnpg.mdx"): "2024-05-02",
    ("cookbook", "infisical-kubernetes-secrets.mdx"): "2024-06-10",
    ("architecture", "bluerobin-system-overview.mdx"): "2024-07-21",
}

# ============================================================
# STEP 2: Articles to mark as draft
# ============================================================
DRAFT_ARTICLES = {
    "local-development-setup-guide.mdx",
    "homelab-dashboarding-homepage-backstage.mdx",
    "figma-mcp-self-optimizing-design-loop.mdx",
    "telegram-integration-architecture-diagrams.mdx",
}

# ============================================================
# STEP 3: Code genericization replacements
# These are applied to ALL non-architecture content files.
# Order matters — longer/more specific patterns first.
# ============================================================
CODE_REPLACEMENTS = [
    # BlueRobinId variants (most specific first)
    ("DomainErrors.BlueRobinId", "DomainErrors.CustomId"),
    ("BlueRobinId.Generate()", "CustomId.Generate()"),
    ("BlueRobinId.NewId()", "CustomId.NewId()"),
    ("BlueRobinId.From(", "CustomId.From("),
    ("BlueRobinId.Value", "CustomId.Value"),
    ("BlueRobinId userId", "CustomId userId"),
    ("BlueRobinId ownerId", "CustomId ownerId"),
    ("BlueRobinId familyId", "CustomId familyId"),
    ("BlueRobinId documentId", "CustomId documentId"),
    ("BlueRobinId id", "CustomId id"),
    ("BlueRobinId?", "CustomId?"),
    ("_user.BlueRobinId", "_user.CustomId"),
    ("user.BlueRobinId", "user.CustomId"),
    ("CurrentUser.BlueRobinId", "CurrentUser.CustomId"),
    ("User.BlueRobinId", "User.CustomId"),
    # Generic BlueRobinId (keep after specific ones)
    ("BlueRobinId", "CustomId"),
    ("bluerobin_id", "app_user_id"),

    # DbContext
    ("BlueRobinDbContext", "AppDbContext"),
    ("BlueRobinDb", "AppDb"),

    # Component base
    ("BlueRobinComponentBase", "AppComponentBase"),

    # Namespaces (most specific first)
    ("Archives.Infrastructure.Ocr", "MyApp.Infrastructure.Ocr"),
    ("Archives.Infrastructure.AI", "MyApp.Infrastructure.AI"),
    ("Archives.Infrastructure.Storage", "MyApp.Infrastructure.Storage"),
    ("Archives.Infrastructure.Repositories", "MyApp.Infrastructure.Repositories"),
    ("Archives.Infrastructure.Security", "MyApp.Infrastructure.Security"),
    ("Archives.Infrastructure.Messaging", "MyApp.Infrastructure.Messaging"),
    ("Archives.Infrastructure.VectorStores", "MyApp.Infrastructure.VectorStores"),
    ("Archives.Infrastructure", "MyApp.Infrastructure"),
    ("Archives.Application.Services", "MyApp.Application.Services"),
    ("Archives.Application.Interfaces", "MyApp.Application.Interfaces"),
    ("Archives.Application.Dto", "MyApp.Application.Dto"),
    ("Archives.Application.Configuration", "MyApp.Application.Configuration"),
    ("Archives.Application", "MyApp.Application"),
    ("Archives.Core.Common", "MyApp.Core.Common"),
    ("Archives.Core.Aggregates", "MyApp.Core.Aggregates"),
    ("Archives.Core.Entities", "MyApp.Core.Entities"),
    ("Archives.Core.ValueObjects", "MyApp.Core.ValueObjects"),
    ("Archives.Core.Enums", "MyApp.Core.Enums"),
    ("Archives.Core.Interfaces", "MyApp.Core.Interfaces"),
    ("Archives.Core", "MyApp.Core"),
    ("Archives.Api", "MyApp.Api"),
    ("Archives.Web", "MyApp.Web"),
    ("Archives.Workers", "MyApp.Workers"),
    ("Archives.SmokeTest", "MyApp.SmokeTest"),
    ("Archives.Performance", "MyApp.Performance"),
    ("Archives.TelegramBot", "MyApp.TelegramBot"),

    # OTel / Meter names
    ("BlueRobin.Api", "MyApp.Api"),
    ("BlueRobin.Infrastructure", "MyApp.Infrastructure"),
    ("BlueRobin.Workers", "MyApp.Workers"),
    ("BlueRobin.Health", "MyApp.Health"),
    ("BlueRobin.Nats", "MyApp.Nats"),
    ("BlueRobin.Documents", "MyApp.Documents"),
    ("BlueRobin.Cache", "MyApp.Cache"),

    # Cache prefix
    ("bluerobin:", "myapp:"),

    # Docker images
    ("ghcr.io/bluerobin/", "registry.example.com/myapp/"),
    ("registry.bluerobin.local/", "registry.example.com/myapp/"),
    ("192.168.0.5:5005/bluerobin/", "registry.example.com/myapp/"),
    ("bluerobin/archives-telegram-bot", "myapp/telegram-bot"),
    ("BlueRobin.Archives.TelegramBot.dll", "MyApp.TelegramBot.dll"),

    # Repo references
    ("viktorrobin/bluerobin-infra", "your-org/my-infra"),
    ("bluerobin-infra", "my-infra"),

    # OIDC clients
    ("bluerobin-web-staging", "my-web-client-staging"),
    ("bluerobin-web", "my-web-client"),

    # Pact names
    ('Pact.V3("BlueRobin.Web", "BlueRobin.Api")', 'Pact.V3("MyApp.Web", "MyApp.Api")'),
    ('"BlueRobin.Api"', '"MyApp.Api"'),
    ('"BlueRobin.Web"', '"MyApp.Web"'),
    ('HonoursPactWith("BlueRobin.Web")', 'HonoursPactWith("MyApp.Web")'),
    ('ServiceProvider("BlueRobin.Api")', 'ServiceProvider("MyApp.Api")'),

    # API client / headers
    ("BlueRobinApiClient", "AppApiClient"),
    ("X-BlueRobin-UserId", "X-App-UserId"),
    ("BlueRobin-TelegramSession", "App-TelegramSession"),
    ("BlueRobinBot", "MyAppBot"),

    # Cert subjects
    ("O=BlueRobin/CN=BlueRobin Root CA", "O=MyOrg/CN=MyOrg Root CA"),
    ("O=BlueRobin/CN=BlueRobin Hardware Root CA", "O=MyOrg/CN=MyOrg Hardware Root CA"),
    ("CN=BlueRobin Root CA", "CN=MyOrg Root CA"),
    ("CN=BlueRobin Hardware Root CA", "CN=MyOrg Hardware Root CA"),
    ("O=BlueRobin", "O=MyOrg"),

    # Connection strings & secrets
    ("ConnectionStrings__BlueRobinDb", "ConnectionStrings__AppDb"),
    ("ARCHIVES_DEV_DB_PASSWORD", "APP_DEV_DB_PASSWORD"),
    ("ARCHIVES_STAGING_DB_PASSWORD", "APP_STAGING_DB_PASSWORD"),
    ("ARCHIVES_PROD_DB_PASSWORD", "APP_PROD_DB_PASSWORD"),
    ("ARCHIVES_DB_PASSWORD", "APP_DB_PASSWORD"),
    ("ARCHIVES_DB_", "APP_DB_"),
    ("BLUEROBIN_WEB_STAGING_OIDC_SECRET", "WEB_STAGING_OIDC_SECRET"),

    # Database names
    ("archives_dev", "myapp_dev"),
    ("archives_staging", "myapp_staging"),
    ("archives_prod", "myapp_prod"),

    # K8s namespaces (careful - only in specific K8s contexts)
    ("archives-staging", "myapp-staging"),
    ("archives-prod", "myapp-prod"),

    # K8s service/deployment names
    ("archives-api-secrets", "myapp-api-secrets"),
    ("archives-api", "myapp-api"),
    ("archives-workers", "myapp-workers"),

    # NATS subjects & streams (in code blocks)
    ("ARCHIVES", "MYAPP"),

    # Infisical project slug
    ("projectSlug: bluerobin", "projectSlug: my-project"),

    # JS interop
    ("bluerobin.initializeChart", "myapp.initializeChart"),

    # CSS design tokens
    ("robin-500", "primary-500"),
    ("robin-blue", "primary-blue"),

    # NER example entity
    ("BlueRobin Inc", "Acme Corp"),

    # Meter name
    ('Meter("BlueRobin.Nats", "1.0.0")', 'Meter("MyApp.Nats", "1.0.0")'),

    # Cluster name
    ("bluerobin-nats", "my-nats"),

    # Victor specific
    ("victor@bluerobin.local", "admin@example.local"),
    ("admin@bluerobin.local", "admin@example.local"),
    ("flux@bluerobin.local", "flux@example.local"),
    ("rbac.bluerobin.local", "rbac.example.local"),
    ("BlogRobin-Devs", "Engineering-Team"),
    ("BlueRobin-Devs", "Engineering-Team"),
    ("@bluerobin.io", "@example.io"),

    # Tailscale
    ("bluerobin-api", "myapp-api"),

    # Extension method
    ("AddBlueRobinTelemetry", "AddAppTelemetry"),
    ("GetRequiredLocalUserId", "GetRequiredCustomId"),

    # Wildcard cert secret
    ("bluerobin-tls", "myapp-tls"),
    ("bluerobin-wildcard", "myapp-wildcard"),
]

# ============================================================
# STEP 4: Narrative text replacements
# Applied more carefully - only outside code blocks
# ============================================================
NARRATIVE_REPLACEMENTS = [
    # Specific phrases first
    ("At BlueRobin, we", "In our project, we"),
    ("at BlueRobin, we", "in our project, we"),
    ("In BlueRobin, we", "In our project, we"),
    ("in BlueRobin, we", "in our project, we"),
    ("For BlueRobin, we", "For our project, we"),
    ("for BlueRobin, we", "for our project, we"),
    ("In the BlueRobin ecosystem", "In our ecosystem"),
    ("In the BlueRobin architecture", "In our architecture"),
    ("the BlueRobin architecture", "our architecture"),
    ("BlueRobin's MVP", "Our MVP"),
    ("BlueRobin's document intelligence", "our document intelligence system"),
    ("For BlueRobin's document intelligence", "For our document intelligence system"),
    ("BlueRobin started", "We started"),
    ("BlueRobin runs on", "Our system runs on"),
    ("powering BlueRobin", "powering our homelab"),
    ("bring BlueRobin on-premise", "bring our services on-premise"),
    ("We use Cloudflare Workers extensively at BlueRobin", "We use Cloudflare Workers extensively in production"),
    ("At BlueRobin, our data model", "In production, our data model"),
    ("BlueRobin microservices", "our microservices"),
    ("architecture like BlueRobin", "architecture like ours"),
    ("production system like BlueRobin", "production system like ours"),
    ("BlueRobin Security", "Homelab Security"),
    ("BlueRobin design system", "our design system"),
    ("In BlueRobin, DDD isn't just theory", "In our project, DDD isn't just theory"),
    ("At BlueRobin, DDD isn't just theory", "In our project, DDD isn't just theory"),
    ("In BlueRobin, RAG powers our document Q&A", "RAG powers our document Q&A"),
    ("BlueRobin Agent", "Design Agent"),
    ("BlueRobin Cluster", "Production Cluster"),
    ("BlueRobin worker", "Production worker"),
    ("BlueRobin System", "Application System"),
    ("BlueRobin Development Timeline", "Project Development Timeline"),
    ("The BlueRobin blog", "Our technical blog"),
    ("the BlueRobin blog", "our technical blog"),
    # Generic catch-all for remaining mentions (careful)
    ("BlueRobin takes security seriously", "we take security seriously"),
    ("Benchmarking storage tiers for BlueRobin", "Benchmarking storage tiers for our homelab"),
]

# ============================================================
# Files to SKIP genericization (intentionally project-specific)
# ============================================================
SKIP_GENERICIZE = {
    "bluerobin-system-overview.mdx",  # Architecture overview - intentionally about BlueRobin
}

# ============================================================
# IMPLEMENTATION
# ============================================================
def update_date(content: str, new_date: str) -> str:
    """Replace pubDate in frontmatter."""
    return re.sub(
        r'^(pubDate:\s*)[\d-]+',
        rf'\g<1>{new_date}',
        content,
        count=1,
        flags=re.MULTILINE,
    )


def add_draft(content: str) -> str:
    """Add draft: true after pubDate line if not already present."""
    if re.search(r'^draft:', content, flags=re.MULTILINE):
        return re.sub(r'^(draft:\s*).*', r'\g<1>true', content, count=1, flags=re.MULTILINE)
    return re.sub(
        r'^(pubDate:\s*[\d-]+)',
        r'\1\ndraft: true',
        content,
        count=1,
        flags=re.MULTILINE,
    )


def apply_replacements(content: str, replacements: list[tuple[str, str]]) -> str:
    """Apply text replacements."""
    for old, new in replacements:
        content = content.replace(old, new)
    return content


def process_file(filepath: Path, new_date: str | None, is_draft: bool, genericize: bool):
    """Process a single file."""
    content = filepath.read_text(encoding="utf-8")
    original = content

    # Update date
    if new_date:
        content = update_date(content, new_date)

    # Add draft flag
    if is_draft:
        content = add_draft(content)

    # Genericize code patterns
    if genericize:
        content = apply_replacements(content, CODE_REPLACEMENTS)
        content = apply_replacements(content, NARRATIVE_REPLACEMENTS)

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        return True
    return False


def main():
    changed = 0
    skipped = 0
    errors = []

    print("=" * 60)
    print("BLOG ARTICLE UPDATE SCRIPT")
    print("=" * 60)

    # Process blog articles
    print(f"\n📝 Processing blog articles in {BLOG_DIR}...")
    for filename, new_date in DATE_MAP.items():
        filepath = BLOG_DIR / filename
        if not filepath.exists():
            errors.append(f"NOT FOUND: {filename}")
            continue

        is_draft = filename in DRAFT_ARTICLES
        genericize = filename not in SKIP_GENERICIZE

        if process_file(filepath, new_date, is_draft, genericize):
            status = " [DRAFT]" if is_draft else ""
            print(f"  ✅ {filename} → {new_date}{status}")
            changed += 1
        else:
            print(f"  ⏭  {filename} (no changes)")
            skipped += 1

    # Process cookbook + architecture
    print(f"\n📚 Processing cookbook & architecture...")
    dir_map = {
        "cookbook": COOKBOOK_DIR,
        "architecture": ARCH_DIR,
    }
    for (dir_key, filename), new_date in EXTRA_DATE_MAP.items():
        base_dir = dir_map[dir_key]
        filepath = base_dir / filename
        if not filepath.exists():
            errors.append(f"NOT FOUND: {dir_key}/{filename}")
            continue

        genericize = filename not in SKIP_GENERICIZE

        if process_file(filepath, new_date, False, genericize):
            print(f"  ✅ {dir_key}/{filename} → {new_date}")
            changed += 1
        else:
            print(f"  ⏭  {dir_key}/{filename} (no changes)")
            skipped += 1

    # Summary
    print("\n" + "=" * 60)
    print(f"SUMMARY: {changed} files updated, {skipped} unchanged")
    if errors:
        print(f"⚠️  ERRORS ({len(errors)}):")
        for e in errors:
            print(f"   {e}")
    print("=" * 60)

    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
