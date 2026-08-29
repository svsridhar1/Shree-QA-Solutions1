# Shree QA Solutions — Internal Appraisal & Audit CRM MVP

An enterprise CRM and Appraisal Management System for **Shree QA Solutions** (Kukatpally, Hyderabad, India), designed with a formal Indian certification business card aesthetic.

---

## 🏛️ Brand System & Design Language

- **Page Background**: Warm Cream / Ivory (`#F5F0E6`).
- **Navbar Emblem**: Stylized Gold-to-Orange Chakra Seal.
- **Brand Typography**:
  - **SHREE** in Deep Red (`#B33A2E`) Serif
  - **QA Solutions** in Deep Navy (`#1B2A4A`)
  - Tagline: *"Excelling the Excellence"* in small italic navy serif
- **Accent Stripes**: Gradient bar (`#E08A3E` to `#B33A2E`) under header and across the footer.
- **Location**: Plot No. 42, 3rd Floor, Phase-1, KPHB Colony, Kukatpally, Hyderabad - 500072, Telangana, India.

---

## 🔑 Demo Access

- **Login URL**: `/login`
- **Email**: `demo@shreeqasolutions.com`
- **Password**: `Demo@2026`
- *(Includes 1-click Auto-Fill button on the login screen for instant evaluation)*

---

## 📊 Core Features & Screens

1. **Executive Dashboard (`/`)**:
   - **4 Top KPI Cards**: Rotating through Gold/Orange, Deep Red, Navy.
   - **3 Critical Risk Monitor Widgets**:
     - 🚨 **Renewals at Risk**: `cert_expiry_date` ≤ 90 days AND no `activity_log` entry in last 14 days.
     - 🔥 **Cold Leads**: `stage = lead` AND no `activity_log` entry in last 14 days.
     - ⏳ **Stalled Engagements**: `stage = in_appraisal` AND no `activity_log` in last 21 days.
     - *All 3 widgets are clickable, immediately filtering the Clients table to that exact set.*
   - **Service Distribution Chart**: Dynamic visual bar chart representing clients across CMMI, ISO, and Security standards.
   - **Recent Activity Feed**: Real-time log of the latest appraisal notes and audit observations.

2. **Client Directory (`/clients`)**:
   - Master directory with search by company, appraiser, or service standard.
   - Stage filter tabs: `Lead`, `In Appraisal`, `Active Certified`, `Renewal Due`, `Lapsed`.
   - Service filters across 16 standards (CMMI DEV, CMMI SVC, PCI DSS, HIPAA, SOC, GDPR, ISO 9001/27001/20000/42001/22301, Cert-In, etc.).
   - Risk badge indicators on table rows.
   - **Client Detail Slide-over Drawer**:
     - Full appraisal info & editable stage/substage controls.
     - Chronological activity log history with author badges and timestamps.
     - **Add Activity Log Form**: Real-time note recording with instant UI and database synchronization that updates last contact date and clears risk status.

3. **In-Appraisal Kanban Pipeline (`/pipeline`)**:
   - Dedicated workflow board for clients in `in_appraisal` stage.
   - 6 sequential appraisal milestones:
     1. **Inquiry**
     2. **Docs Collected**
     3. **Assessment**
     4. **Site Visit**
     5. **Report**
     6. **Sign-off**
   - **Drag & Drop**: Native smooth card dragging between columns with instant optimistic update and persistence to Supabase database.
   - **Stalled Alerts**: Visual warning badges on cards idle for >21 days.

---

## 🗄️ Database & Supabase Integration

The app connects to Supabase with real-time sync and built-in seed dataset fallback:
- Schema file located at [`supabase/schema.sql`](./supabase/schema.sql)
- 20 realistic Indian mock clients across Hyderabad IT/defense/fintech clusters (Vantara Technologies, Meridian Software Labs, Sundar Fintech Pvt Ltd, Krishna Infosystems, etc.).

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```
