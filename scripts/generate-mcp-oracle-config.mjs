#!/usr/bin/env node
import fs from "node:fs";

function loadDotEnv() {
  if (!fs.existsSync(".env")) return;
  const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function fail(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

function toBoolString(value, key) {
  const normalized = String(value ?? "").trim().toLowerCase() || "false";
  if (normalized !== "true" && normalized !== "false") {
    fail(`${key} must be true or false.`);
  }
  return normalized;
}

loadDotEnv();

const serverName = (process.env.ORACLE_MCP_SERVER_NAME || "oracle_adb_mcp_server").trim();
const description = (process.env.ORACLE_MCP_DESCRIPTION || "Oracle Autonomous Database MCP server (OAuth)").trim();
const remoteUrlRaw = (process.env.ORACLE_MCP_REMOTE_URL || "").trim();
const region = (process.env.ORACLE_ADB_REGION || "").trim();
const databaseOcid = (process.env.ORACLE_ADB_DATABASE_OCID || "").trim();
const allowHttp = toBoolString(process.env.ORACLE_MCP_ALLOW_HTTP, "ORACLE_MCP_ALLOW_HTTP");

if (!serverName) fail("ORACLE_MCP_SERVER_NAME cannot be empty.");

let remoteUrl = remoteUrlRaw;
if (!remoteUrl) {
  if (!region) fail("ORACLE_ADB_REGION is required when ORACLE_MCP_REMOTE_URL is empty.");
  if (!databaseOcid) fail("ORACLE_ADB_DATABASE_OCID is required when ORACLE_MCP_REMOTE_URL is empty.");
  remoteUrl = `https://dataaccess.adb.${region}.oraclecloudapps.com/adb/mcp/v1/databases/${databaseOcid}`;
}

if (remoteUrl.startsWith("https://")) {
  // secure path
} else if (remoteUrl.startsWith("http://")) {
  if (allowHttp !== "true") {
    fail("HTTP URL detected. Set ORACLE_MCP_ALLOW_HTTP=true only for local debug.");
  }
} else {
  fail("ORACLE_MCP_REMOTE_URL must start with https:// (or http:// only with ORACLE_MCP_ALLOW_HTTP=true).");
}

const args = ["-y", "mcp-remote", remoteUrl];
if (allowHttp === "true") args.push("--allow-http");

const payload = {
  mcpServers: {
    [serverName]: {
      description,
      command: "npx",
      args,
      transport: "streamable-http",
    },
  },
};

process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
