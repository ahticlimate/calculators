# Ahti POC Template

This project is a small React + TypeScript app built with Vite. It is meant to be used as a clean starting point for Ahti Consulting proof-of-concept apps.

This README is written for a new user on a Mac who wants to:

- install the required software
- run the project locally
- build a production-ready static package for Netlify

---

## 1) What you need on your Mac

You need Node.js and npm installed.

Node.js is the runtime that lets the app build and run. npm is the package manager that installs the project dependencies.

### Recommended setup: use nvm (Node Version Manager)

This is the easiest and most reliable way to manage Node on a Mac.

1. Open Terminal.
2. Install nvm with:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

3. Close and reopen Terminal.
4. Install a current LTS version of Node:

```bash
nvm install 20
nvm use 20
```

5. Confirm it worked:

```bash
node -v
npm -v
```

You should see a Node version and an npm version printed in the terminal.

### Alternative: install Node via Homebrew

If you prefer Homebrew, run:

```bash
brew install node
```

Then confirm:

```bash
node -v
npm -v
```

### If you are asked to install Xcode Command Line Tools

Some Mac setups need this for build tools. If Terminal asks for it, run:

```bash
xcode-select --install
```

---

## 2) Download the project

If you have the project already locally, open the folder in VS Code or in Terminal.

Example:

```bash
cd ~/path/to/ahti-poc-template
```

---

## 3) Install project dependencies

From the project folder, run:

```bash
npm install
```

This installs all packages needed by the app.

If you see warnings, they are usually not blockers. If an installation fails, make sure Node and npm are installed correctly.

---

## 4) Run the app locally

Start the local development server with:

```bash
npm run dev
```

This starts Vite and typically prints a URL like:

```text
http://localhost:5173/
```

Open that in your browser.

If the page does not open, look at the terminal output. Vite may use a different local port if 5173 is occupied.

### Useful local dev notes

- The app is hot-reloaded, so edits show up automatically while you are developing.
- The development server is for local preview only. It is not the production deployment build.

---

## 5) Build the production static package

When you are ready to ship the app, build the static bundle:

```bash
npm run build
```

This creates a production folder called:

```text
dist/
```

Inside that folder you will find the compiled static site assets.

This is the package you can deploy to Netlify or any static hosting provider.

### What the build does

The build step compiles the React app, bundles the JavaScript, and generates static HTML/CSS assets that a browser can serve without a Node server.

---

## 6) Prepare for Netlify

Netlify can deploy this project as a static site.

### Option A: Drag and drop the dist folder

1. Go to Netlify.
2. Log in or sign up.
3. Choose "Add new site" and then "Deploy manually".
4. Drag the dist folder into Netlify.
5. Netlify will publish the site.

### Option B: Use a build command and publish directory

In Netlify, use:

- Build command: `npm run build`
- Publish directory: `dist`

This is the standard setup for a Vite app.

---

## 7) Typical commands summary

From the project root:

```bash
npm install
npm run dev
npm run build
```

---

## 8) Quick troubleshooting

### "node: command not found"

This usually means Node is not installed or not active in your shell.

Try:

```bash
node -v
```

If it fails, install Node again using nvm or Homebrew.

### "npm: command not found"

This is the same issue: npm is not installed or your shell cannot see it.

Try:

```bash
which node
which npm
```

### The app runs but looks broken

Run a fresh install:

```bash
rm -rf node_modules package-lock.json
npm install
```

### The build fails

Make sure you are in the project root and dependencies are installed:

```bash
npm install
npm run build
```

---

## 9) Final note

This project is designed as a lightweight static front-end template for Ahti consulting POCs. It is simple to run locally, and the production output is ready to ship to Netlify as a static site.

If you want to start building your actual prototype, you can now replace the placeholder content in the app with your own business logic, UI sections, and calculations.
