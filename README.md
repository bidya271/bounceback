# Bounceback
### Dedicated to Everyone Overcoming a Layoff · Powered by Quarkfin Technology Private Limited

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-121211.svg?style=flat-square)](https://www.gnu.org/licenses/agpl-3.0)
[![Brand: Quarkfin](https://img.shields.io/badge/Brand-Quarkfin-D94E28.svg?style=flat-square)](https://github.com/bidya271/bounceback)
[![Privacy: 100% Local](https://img.shields.io/badge/Privacy-100%25_On--Device-166E48.svg?style=flat-square)](#privacy-first)

https://github.com/user-attachments/assets/bounceback_intro.mp4

> **Watch the Launch Intro:** [`public/video/bounceback_intro.mp4`](public/video/bounceback_intro.mp4)

**Bounceback** is an open-source, private, self-hosted career command center and application tailoring engine designed to help professionals bounce back after layoffs.

Built with an **Anti-Gravity editorial design system**, Bounceback turns your master career history into highly tailored, ATS-aligned resumes, cover letters, and outreach emails in seconds—powered by 100% on-device local AI or your own API keys.

---

## Why Bounceback?

When unexpected workforce reductions happen, job hunting is a numbers and stamina game. Generic AI copy gets rejected by recruiters, manual tailoring takes hours per application, and third-party SaaS platforms sell or train on your personal data.

Bounceback changes the rules:
- **Single Source of Truth:** Keep your complete career history, raw metrics, project milestones, and certifications in one secure place.
- **Role-Targeted Generation:** Paste any job posting URL or text. Bounceback scores your fit, highlights qualification gaps, and generates targeted resume bullet points tailored to the role.
- **Anti-Gravity Editorial Design:** High-contrast, tactile typographic resume templates crafted for human readability and ATS parsing. One-click PDF download with no third-party rendering servers.
- **Full Application CRM:** Track every lead from `Draft` to `Applied`, `Interview`, and `Offer`.
- **Zero-Cloud Privacy:** Runs completely on your own machine. Runs with local models (Qwen 2.5, Llama 3 via Ollama) with zero subscription fees.
- **AI Agent & MCP Skill:** Includes a native **Model Context Protocol (MCP)** server so you can instruct Claude Code, Cursor, or Antigravity to run your job search pipeline directly from chat.

---

## Quick Start (Run Bare-Metal on macOS / Linux)

### 1. Prerequisites
- **Node.js** (v20+) and **PostgreSQL** (v16+)
- *(Optional)* **Ollama** for 100% free, private local AI inference (`ollama pull qwen2.5:7b`)

### 2. Clone & Install
```bash
git clone https://github.com/bidya271/bounceback.git
cd bounceback
corepack enable
yarn install
```

### 3. Configure Database & Secrets
```bash
# Create local database
createdb bounceback

# Set up environment
cp .env.example .env
```
Generate your secrets:
```bash
echo "BOUNCEBACK_SECRET=$(openssl rand -hex 32)" >> .env
echo "DATABASE_URL=\"postgresql://localhost:5432/bounceback\"" >> .env
echo "BOUNCEBACK_PASSWORD=your_secure_password" >> .env
```

### 4. Run Migrations & Start
```bash
npx prisma migrate deploy
yarn dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Using as an Agent Skill (Claude / Cursor / Antigravity)

Bounceback includes an agent skill definition at `skills/bounceback/SKILL.md`.

You can connect your local AI agent (Claude Code, Antigravity, or Cursor) to your Bounceback instance via MCP:

```json
{
  "mcpServers": {
    "bounceback": {
      "url": "http://localhost:3000/api/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_BOUNCEBACK_TOKEN>"
      }
    }
  }
}
```

---

## License & Credits

Distributed under the **AGPL-3.0 License**.

Crafted with resilience by **Quarkfin Technology Private Limited**. Dedicated to every builder bouncing back stronger.
