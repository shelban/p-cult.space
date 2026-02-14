---
name: block-hardcoded-secrets
enabled: true
event: file
action: block
conditions:
  - field: new_text
    operator: regex_match
    pattern: (API_KEY|SECRET|TOKEN|PASSWORD|NOTION_TOKEN|YOUTUBE_KEY|CLOUDFLARE_TOKEN|GITHUB_TOKEN)\s*[=:]\s*["'][^"'\s]{10,}
---

🚨 **Hardcoded secret detected!**

Found what looks like a hardcoded credential in file content.

**Required actions:**
1. Use environment variables: `process.env.API_KEY`
2. Add secret file to .gitignore if not already there
3. Store secrets in .env (never commit .env)
4. For n8n workflows: use credentials store, not hardcoded values

**Operation blocked** to prevent accidental secret exposure.

If this is a false positive (e.g., example code, documentation), use placeholder values like `"your-api-key-here"` instead.
