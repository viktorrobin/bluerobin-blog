#!/usr/bin/env python3
"""
Second pass: clean up remaining BlueRobin references in prose, diagrams, and descriptions.
Run from bluerobin-blog root: python3 scripts/update-articles-pass2.py
"""

import os
import re
import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "src" / "content" / "blog"

# Files to SKIP (intentionally project-specific or already draft)
SKIP_FILES = set()

# Additional replacements for remaining references
EXTRA_REPLACEMENTS = [
    # Descriptions (frontmatter)
    ('running BlueRobin on-premise', 'running on-premise'),
    ('Why BlueRobin moved from standard UUIDs', 'Why we moved from standard UUIDs'),
    ('of the BlueRobin Telegram Bot on Kubernetes', 'of a Telegram Bot on Kubernetes'),
    ('the BlueRobin Telegram integration', 'our Telegram integration'),
    ('for BlueRobin that enables passkey', 'that enables passkey'),
    ("for BlueRobin. Empowering", "for our platform. Empowering"),
    ("the full BlueRobin stack locally", "the full stack locally"),
    ('the BlueRobin Telegram Bot', 'our Telegram Bot'),
    ('"BlueRobin Telegram Integration Architecture"', '"Telegram Integration Architecture"'),

    # Prose / narrative
    ('a data-intensive platform like BlueRobin', 'a data-intensive platform like ours'),
    ('migrate BlueRobin to a dedicated', 'migrate to a dedicated'),
    ('BlueRobin is storage-heavy', 'Our system is storage-heavy'),
    ('BlueRobin manages personal archives', 'Our platform manages personal archives'),
    ('as we built BlueRobin\'s public-facing', 'as we built our public-facing'),
    ('a custom ID generator for BlueRobin', 'a custom ID generator'),
    ('the BlueRobin frontend to Tailwind', 'our Blazor frontend to Tailwind'),
    ('keeps BlueRobin\'s architecture clean', 'keeps our architecture clean'),
    ('how BlueRobin integrates complex', 'how we integrate complex'),
    ('expose the `BlueRobin` dashboard', 'expose our dashboard'),
    ('the BlueRobin homelab server', 'our homelab server'),
    ('the entire BlueRobin platform', 'the entire platform'),
    ('in BlueRobin using Qdrant', 'using Qdrant'),
    ('the BlueRobin application layer', 'our application layer'),
    ('Welcome to BlueRobin!', 'Welcome!'),
    ('the "BlueRobin Local" environment', 'the local development environment'),
    ('For BlueRobin, where users upload', 'In our system, where users upload'),
    ('our BlueRobin infrastructure', 'our infrastructure'),
    ('our BlueRobin cluster', 'our Kubernetes cluster'),
    ('the BlueRobin API and MinIO', 'our API and MinIO'),
    ('Exposing the BlueRobin API', 'Exposing the API'),
    ('the Shared Kernel in BlueRobin', 'our Shared Kernel'),
    ('the entire BlueRobin ecosystem', 'the entire ecosystem'),
    ('BlueRobin uses a specialized', 'We use a specialized'),
    ('architecture for BlueRobin', 'architecture for our platform'),
    ('uploaded to BlueRobin.', 'uploaded to the platform.'),
    ('uploads a document to BlueRobin', 'uploads a document to our platform'),
    ('For BlueRobin, Traefik is the front door', 'Traefik is the front door'),
    ('for BlueRobin services', 'for our services'),
    ('account to BlueRobin using', 'account to our platform using'),
    ('the BlueRobin Telegram integration', 'our Telegram integration'),
    ('User opens BlueRobin bot', 'User opens the bot'),
    ('sign in to BlueRobin', 'sign in'),
    ('Connecting to BlueRobin...', 'Connecting...'),
    ('Setup Passkey - BlueRobin', 'Setup Passkey'),
    ('document assistant for BlueRobin, a personal', 'document assistant for a personal'),

    # Series name in frontmatter
    ('name: "BlueRobin Architecture"', 'name: "System Architecture"'),
    ('"BlueRobin Local Development Setup Guide"', '"Local Development Setup Guide"'),
    ('"BlueRobin Telegram Bot"', '"Telegram Bot"'),
    ("BlueRobin document management", "document management"),

    # Diagrams and code blocks
    ('WebApp["🐦 BlueRobin Web"]', 'WebApp["🐦 Web App"]'),
    ('client_name: BlueRobin Web', 'client_name: My Web App'),
    ('options.Cookie.Name = "BlueRobin.Session"', 'options.Cookie.Name = "MyApp.Session"'),
    ('subgraph NanoID ["NanoID (BlueRobin)"]', 'subgraph NanoID ["NanoID (Custom)"]'),
    ('subgraph "BlueRobin Namespace"', 'subgraph "Application Namespace"'),
    ('subgraph BlueRobin ["Application System"]', 'subgraph App ["Application System"]'),
    ('subgraph API["BlueRobin API"]', 'subgraph API["Backend API"]'),
    ('participant API as BlueRobin API', 'participant API as Backend API'),
    ('participant API as ⚙️ BlueRobin API', 'participant API as ⚙️ Backend API'),
    ('participant Web as 🌐 BlueRobin Web', 'participant Web as 🌐 Web App'),
    ('participant B as BlueRobin Bot', 'participant B as Telegram Bot'),

    # Cache instance name
    ('options.InstanceName = "BlueRobin:"', 'options.InstanceName = "MyApp:"'),

    # OTel wildcard sources
    ('.AddSource("BlueRobin.*")', '.AddSource("MyApp.*")'),
    ('.AddMeter("BlueRobin.*")', '.AddMeter("MyApp.*")'),

    # HttpClient
    ('httpClientFactory.CreateClient("BlueRobinApi")', 'httpClientFactory.CreateClient("MyAppApi")'),

    # Docker labels & entrypoint
    ('COPY ["BlueRobin.sln", "./"]', 'COPY ["MyApp.sln", "./"]'),
    ('image.title="BlueRobin Telegram Bot"', 'image.title="Telegram Bot"'),
    ('image.description="Telegram bot for BlueRobin document management"', 'image.description="Telegram bot for document management"'),
    ('ENTRYPOINT ["dotnet", "BlueRobin.', 'ENTRYPOINT ["dotnet", "MyApp.'),
    
    # Log output
    ('info: BlueRobin.', 'info: MyApp.'),

    # NER example
    ('anyone who works for BlueRobin', 'anyone who works for Acme Corp'),
    ("{name: 'BlueRobin'}", "{name: 'Acme Corp'}"),

    # Workflow/n8n
    ('[View in BlueRobin](https://app.bluerobin.local/', '[View Document](https://app.example.local/'),

    # Series nav
    ('5. **BlueRobin Telegram Integration Architecture**', '5. **Telegram Integration Architecture**'),
]


def apply_replacements(content: str, replacements: list[tuple[str, str]]) -> str:
    """Apply text replacements."""
    for old, new in replacements:
        content = content.replace(old, new)
    return content


def main():
    changed = 0
    print("Pass 2: Cleaning remaining BlueRobin references...")
    
    for filepath in sorted(BLOG_DIR.glob("*.mdx")):
        if filepath.name in SKIP_FILES:
            continue
        
        content = filepath.read_text(encoding="utf-8")
        original = content
        
        content = apply_replacements(content, EXTRA_REPLACEMENTS)
        
        if content != original:
            filepath.write_text(content, encoding="utf-8")
            print(f"  ✅ {filepath.name}")
            changed += 1

    print(f"\nDone: {changed} files updated")

    # Check remaining
    import subprocess
    result = subprocess.run(
        ["grep", "-rn", "BlueRobin", str(BLOG_DIR), "--include=*.mdx"],
        capture_output=True, text=True
    )
    remaining = [l for l in result.stdout.strip().split('\n') if l and "blog.bluerobin.io" not in l]
    if remaining:
        print(f"\n⚠️  {len(remaining)} remaining references:")
        for line in remaining[:20]:
            short = line.replace(str(BLOG_DIR) + "/", "")
            print(f"   {short}")
    else:
        print("\n✅ All BlueRobin references removed (except canonical URLs)!")


if __name__ == "__main__":
    main()
