<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=DM+Sans&weight=700&size=30&pause=1200&color=0EA5E9&center=true&vCenter=true&width=760&lines=See+the+blockage.+Stop+the+flood.;AquaGuardian+turns+reports+into+action." alt="AquaGuardian: See the blockage. Stop the flood.">
</p>

<p align="center">
  <img src="./public/simulated/678c1b5d6e66d636f0b4e3304d006f67dee8da98.jpg" alt="A canal obstructed by floating waste" width="360">
</p>

<p align="center">
  <strong>A community reporting prototype for detecting river and drainage waste before it becomes a flood risk.</strong>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Start-Local%20demo-0EA5E9?style=for-the-badge&logo=vite&logoColor=white" alt="Start local demo"></a>
  <a href="#how-it-works"><img src="https://img.shields.io/badge/Mission-Prevent%20flooding-16A34A?style=for-the-badge&logo=leaflet&logoColor=white" alt="Prevent flooding"></a>
  <a href="#technology"><img src="https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-0F172A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Built with React and Vite"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Prototype-F59E0B?style=flat-square" alt="Prototype status">
  <img src="https://img.shields.io/badge/Reports-Simulated-64748B?style=flat-square" alt="Simulated reports">
  <img src="https://img.shields.io/badge/Data-Keyless-16A34A?style=flat-square" alt="No API keys required">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UTCC%20AI%20Hackathon%202026-1st%20Runner--Up-F59E0B?style=for-the-badge&logo=trophy&logoColor=white" alt="UTCC AI Hackathon 2026: 1st Runner-Up">
</p>

> [!NOTE]
> **Awarded 1st Runner-Up** at **UTCC AI Hackathon 2026: The STEM Innovation**, with a **10,000 THB scholarship**.

## The Problem

When waste blocks a canal or drain, a small obstruction can become a flooding emergency. The people who see the problem first are often the people who have no quick way to report it with useful context.

**AquaGuardian makes a report visible, locatable, and easier to prioritize.**

| What people see | What AquaGuardian captures | What teams can act on |
| :--- | :--- | :--- |
| Waste, weeds, sediment, or high water | Photo, location, description, and risk category | A map-based queue of issues that need attention |

## How It Works

```mermaid
flowchart LR
    A["1. Spot a blocked waterway"] --> B["2. Capture or upload a photo"]
    B --> C["3. Add location and context"]
    C --> D["4. Classify flood-risk signal"]
    D --> E["5. View and prioritize on the map"]
    style A fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e
    style B fill:#dcfce7,stroke:#16a34a,color:#14532d
    style C fill:#fef3c7,stroke:#d97706,color:#78350f
    style D fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    style E fill:#ede9fe,stroke:#7c3aed,color:#4c1d95
```

## What You Can Do

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>Capture the evidence</h3>
      Upload a photo, add a short description, and let the browser attach the current location.
    </td>
    <td width="33%" valign="top">
      <h3>Spot flood-risk signals</h3>
      Reports are categorized around waste, vegetation, sediment, and water-level risk.
    </td>
    <td width="33%" valign="top">
      <h3>See the citywide picture</h3>
      A map and dashboard help users compare reports and identify areas that need attention.
    </td>
  </tr>
</table>

> [!IMPORTANT]
> This is an interactive prototype. The current image-classification result is simulated so the demo runs without an API key or backend. A production release should move image analysis and report storage to secured server-side services.

## Technology

| Layer | Tools |
| :--- | :--- |
| Interface | React 19, React Router, Tailwind CSS |
| Mapping | Leaflet, React Leaflet, Carto tiles |
| Weather context | Open-Meteo public API |
| Build tooling | Vite 8, ESLint |
| Icons | Lucide React |

## Quick Start

```bash
git clone https://github.com/betauzi/AquaGuardian.git
cd AquaGuardian
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run lint` | Check code quality |
| `npm run preview` | Preview the production build locally |

## Project Map

```text
src/
  pages/
    LandingPage.jsx     Mission and entry point
    UploadReport.jsx    Photo report workflow
    Dashboard.jsx       Map, weather, and report overview
  simulatedReports.js   Demo flood-risk reports
  App.jsx               Routes and mobile-style application shell
public/simulated/       Demo images used by the prototype
```

## Build It Into a Real Service

The prototype is deliberately keyless. For a production rollout, add a protected backend for:

- Image analysis and confidence scoring
- Authenticated report submission and moderation
- Secure storage for uploaded photos
- Routing reports to local response teams
- Notifications when a high-risk area receives multiple reports

Keep all credentials server-side. Do not put API keys in React source code or browser environment variables.

## License

No license has been declared for this repository. Add a `LICENSE` file before distributing or accepting external contributions.
