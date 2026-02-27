#!/usr/bin/env python3
"""
Third pass: clean up remaining lowercase bluerobin references.
Run from bluerobin-blog root: python3 scripts/update-articles-pass3.py
"""

import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "src" / "content" / "blog"
COOKBOOK_DIR = Path(__file__).parent.parent / "src" / "content" / "cookbook"

REPLACEMENTS = [
    # Cert domains (keep *.bluerobin.local as user requested, but fix non-domain refs)
    ('ca-certificates/bluerobin-root.crt', 'ca-certificates/myorg-root.crt'),
    
    # Flux cluster path
    ('clusters/bluerobin/', 'clusters/my-cluster/'),
    ('clusters/bluerobin \\', 'clusters/my-cluster \\'),
    ('clusters/bluerobin\n', 'clusters/my-cluster\n'),
    
    # Cache prefix
    ('Prefix = "bluerobin"', 'Prefix = "myapp"'),
    
    # PostgreSQL user
    ('CREATE USER bluerobin_api', 'CREATE USER myapp_api'),
    ('GRANT app_readwrite TO bluerobin_api', 'GRANT app_readwrite TO myapp_api'),
    
    # Architecture link
    ('/architecture/bluerobin-system-overview', '/architecture/system-overview'),
    
    # Repo diagram refs
    ('App[bluerobin-app]', 'App[my-app]'),
    ('AppRepo[bluerobin-app]', 'AppRepo[my-app]'),
    ('bluerobin-app/.github', 'my-app/.github'),
    
    # NATS context
    ('nats context add bluerobin', 'nats context add my-cluster'),
    ('nats context select bluerobin', 'nats context select my-cluster'),
    
    # Infisical project
    ('named `bluerobin`', 'named `my-project`'),
    
    # Tailnet
    ('`bluerobin` tailnet', '`my-tailnet` tailnet'),
    
    # Kustomize path ref
    ('my-infra/clusters/bluerobin/', 'my-infra/clusters/my-cluster/'),
]


def main():
    changed = 0
    dirs = [BLOG_DIR, COOKBOOK_DIR]
    
    print("Pass 3: Cleaning lowercase bluerobin references...")
    
    for d in dirs:
        for filepath in sorted(d.glob("*.mdx")):
            content = filepath.read_text(encoding="utf-8")
            original = content
            
            for old, new in REPLACEMENTS:
                content = content.replace(old, new)
            
            if content != original:
                filepath.write_text(content, encoding="utf-8")
                print(f"  ✅ {filepath.name}")
                changed += 1

    print(f"\nDone: {changed} files updated")

    # Check remaining non-domain bluerobin refs
    import subprocess
    result = subprocess.run(
        ["grep", "-rn", "bluerobin", str(BLOG_DIR), str(COOKBOOK_DIR), "--include=*.mdx"],
        capture_output=True, text=True
    )
    remaining = [l for l in result.stdout.strip().split('\n') if l and 
                 ".bluerobin.local" not in l and 
                 "blog.bluerobin.io" not in l and
                 ".bluerobin.io" not in l and
                 "@bluerobin" not in l and
                 "@example" not in l]
    if remaining:
        print(f"\n⚠️  {len(remaining)} remaining lowercase references:")
        for line in remaining[:20]:
            short = line.split("/content/")[-1] if "/content/" in line else line
            print(f"   {short}")
    else:
        print("\n✅ All non-domain bluerobin references removed!")


if __name__ == "__main__":
    main()
