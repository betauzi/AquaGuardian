# AquaGuardian

A responsive web prototype for reporting and tracking community water problems such as flooding and blocked drains. The current application uses simulated reports so it can be run without a backend or credentials.

## Features

- Browse reported water issues on a dashboard and map view.
- Submit a new report through a mobile-focused interface.
- Review simulated report data locally in the browser.

## Technology

- React 19
- Vite 8
- React Router
- Tailwind CSS
- Leaflet and React Leaflet

## Requirements

- Node.js 20 or later
- npm

## Getting Started

```bash
git clone https://github.com/betauzi/AquaGuardian.git
cd AquaGuardian
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Configuration

No environment variables are required for the current prototype. Do not commit API keys, tokens, or production service credentials when adding a backend or AI integration.

## Project Structure

```text
src/
  pages/              Application screens
  simulatedReports.js Local demo data
  App.jsx             Routes and application shell
```

## Security Notes

This repository contains demo data only. Keep user reports and any future service credentials outside the repository, and provide non-sensitive sample configuration files when configuration is introduced.

## License

No license has been declared for this repository. Add a `LICENSE` file before distributing or accepting external contributions.
