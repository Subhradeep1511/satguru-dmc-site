const fs = require('fs');
const path = require('path');

/**
 * Helper to dynamically parse a .env file and return it as a key-value object.
 * This ensures PM2 config has zero hardcoded secrets or environment variables.
 */
function loadEnv(file) {
  const filePath = path.resolve(__dirname, file);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const env = {};
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const separatorIdx = trimmed.indexOf('=');
    if (separatorIdx === -1) continue;
    
    const key = trimmed.substring(0, separatorIdx).trim();
    let val = trimmed.substring(separatorIdx + 1).trim();
    
    // Strip surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

module.exports = {
  apps: [
    {
      name: "satguru-frontend",
      script: "server.js",
      cwd: "./",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: loadEnv('.env')
    },
    {
      name: "satguru-cms",
      script: "npm",
      args: "run start",
      cwd: "./cms",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      env: loadEnv('cms/.env')
    }
  ]
};
