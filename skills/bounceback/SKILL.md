---
name: bounceback
description: Career revival & application command center dedicated to everyone navigating tech layoffs. Enables AI coding agents, Claude Code, Cursor, and Antigravity to inspect candidate profiles, score job postings against background, draft targeted resumes and cover letters, and track pipeline status through local MCP tools or direct database integration.
---

# Bounceback: Career Command Center by Quarkfin

Bounceback is an open-source, private career acceleration engine built to help job seekers bounce back after tech layoffs. It provides a local source of truth for work history, skills, and projects, coupled with a private Model Context Protocol (MCP) server and AI orchestration.

---

## When to Use This Skill

Activate this skill whenever:
1. The user provides a job posting URL or job description and asks to:
   - Match or score their career fit against the job requirements.
   - Tailor an ATS-optimized resume.
   - Draft a role-specific cover letter or application outreach email.
2. The user wants to track application lifecycle events (`Draft`, `Applied`, `Interview`, `Offer`).
3. The user wants to pull or sync their master resume data across local AI agents and assistants.

---

## Architecture & Integration Modes

### Mode 1: Agentic MCP Integration (Claude / Cursor / Antigravity)
Bounceback exposes a native Model Context Protocol (MCP) endpoint at:
`http://localhost:3000/api/mcp`

#### Available Tools Exposed to Agents:
- **`get_profile`**: Retrieves the candidate's master career profile (experiences, projects, education, skills, metrics).
- **`get_posting`**: Resolves and parses a job posting from a URL, pasted text, or saved listing.
- **`score_posting`**: Analyzes requirement match (covers / partial / gap) and computes a fit percentage.
- **`save_application`**: Saves a tailored resume, cover letter, and match breakdown directly into the candidate's pipeline.
- **`set_application_status`**: Advances an application through stages (`DRAFT` → `SENT` → `INTERVIEW` → `OFFER`).

#### MCP Configuration Snippet:
```json
{
  "mcpServers": {
    "bounceback": {
      "url": "http://localhost:3000/api/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_BOUNCEBACK_ACCESS_TOKEN>"
      }
    }
  }
}
```

---

## Mode 2: Direct Local Database / Code Execution
When running locally on the same host, agents can directly read from and update the candidate's Postgres database:
- **Database URL:** `postgresql://localhost:5432/bounceback`
- **Tables:** `ProfileField`, `Experience`, `Skill`, `Education`, `Project`, `Application`, `Document`

---

## Core Guidelines for Tailoring (Anti-Gravity Editorial Standard)

When drafting resumes and cover letters using this skill:
1. **Zero Slop:** Avoid empty buzzwords ("synergy", "spearheaded", "rockstar", "fast-paced world").
2. **Hard Metrics First:** Anchor achievements to concrete numbers, latency reductions, team throughput, or financial KPIs.
3. **ATS Alignment:** Match the exact technical vocabulary and core qualification terms from the job posting while staying 100% faithful to the candidate's actual experience.
4. **Privacy:** Never transmit candidate private notes or contact credentials to external APIs without confirmation.
