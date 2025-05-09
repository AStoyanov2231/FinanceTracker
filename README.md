# 💰 Finance Tracker

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-35.1-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

A modern finance management desktop application that helps you track expenses and saving goals.

## ✨ Features

- 📊 **Expense Tracking**: Add, edit, and delete expenses with categories
- 🎯 **Saving Goals**: Set financial targets and track your progress
- 📈 **Dashboard**: View summaries and visualizations of your financial data
- 🖥️ **Cross-Platform**: Works on Windows, macOS, and Linux
- 🔒 **Local Storage**: All data is stored locally on your device for privacy

## 📋 Table of Contents

- [Prerequisites](#%EF%B8%8F-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [License](#-license)

## 🛠️ Prerequisites

- **Node.js**: v18.20.7 or higher
- **npm**: v10.8.2 or higher

## 📥 Installation

1. Clone the repository
   ```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Install dependencies
   ```bash
npm install
```

## 💻 Development

### Run in Development Mode

To run the app in development mode with hot reloading:

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server
- Launch the Electron app pointing to the dev server

## 🚀 Building for Production

### Step 1: Build the application
```bash
npm run build
```

### Step 2: Package for your platform

#### For Windows:
```bash
npx electron-builder --win
```

This will create:
- A portable .exe file
- An installer .exe file
- Files will be in the `dist_electron` directory

#### For macOS (must be run on a Mac):
```bash
npx electron-builder --mac
```

#### For Linux:
```bash
npx electron-builder --linux
```

## ❓ Troubleshooting

### Common Issues

#### "Cannot find module 'electron-is-dev'"
This is fixed in the latest version. The app uses a built-in method to detect development mode.

#### File locking errors during build
If you encounter errors about files being locked during build:
1. Make sure all instances of the app are closed
2. Restart your computer
3. Try deleting the `dist_electron` directory before building again

## 📁 Project Structure

| Directory | Description |
|-----------|-------------|
| `/src` | React application code |
| `/src/components` | Reusable UI components |
| `/src/contexts` | React context for state management |
| `/src/pages` | Main application pages |
| `/src/utils` | Helper functions and utilities |
| `/electron` | Electron configuration files |
| `/public` | Static assets |

## 📄 License

MIT


 