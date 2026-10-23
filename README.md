# SiteSift — Dual-Agent AI Website Crawler & Conversion Weakness Auditor

SiteSift is an AI-powered intelligence and audit tool that crawls websites, extracts rich on-page metadata and hierarchical content, and diagnoses conversion bottlenecks, UX friction, and customer-loss weaknesses.

---

## 🚀 Key Features

1. **Intelligent Web Crawler**:
   - Crawls the primary landing page plus key internal subpages (`/pricing`, `/about`, `/services`, `/contact`).
   - Extracts complete metadata (title, meta description, keywords, canonical, robots directives).
   - Audits Open Graph (`og:*`) & Twitter cards with a live Google SERP search snippet simulation.
   - Extracts heading hierarchy (H1-H6) and flags missing or duplicate H1 tags.
   - Audits images missing accessibility `alt` attributes.
   - Detects forms, interactive CTAs, email/phone links, and social media channels.

2. **Agent 1: Extraction & Structuring AI Agent**:
   - Synthesizes raw website content into a structured business blueprint.
   - Identifies core value proposition, positioning, target audience (ICP), market segment, and primary conversion funnels.

3. **Agent 2: Business Weakness & Revenue Leak Auditor**:
   - Acts as a seasoned Conversion Rate Optimization (CRO) expert.
   - Uncovers exact friction points that are costing the business owner paying customers.
   - Provides severity ratings (Critical, High, Medium, Low), drop-off locations, psychological customer drop-off explanations, and concrete actionable fixes.
   - Calculates a Conversion Health Score (0-100) and Revenue Risk Level.
   - Delivers top priority quick-wins to implement immediately.

4. **Executive Dashboard**:
   - Professional, clean, and modern dark-mode interface with zero AI slop.
   - Dynamic conversion gauge, severity filters, SERP preview, and tabbed inspection views.

5. **Downloadable CSV Export**:
   - 1-click download of all audit data, metadata, customer drop-off points, and remedies in RFC4180 format.

---

## 🔑 Adding Your OpenRouter API Key

Open the `backend/.env` file and paste your OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=google/gemini-2.5-flash
PORT=5000
```

*(You can also set or change your API key directly in the web UI using the "API Key" button on the top right).*

---

## 🏃 Running SiteSift

Both the backend and frontend are already configured and running locally:

- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

To start them manually in separate terminals:

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```
