#!/usr/bin/env sh
set -eu

# Load local environment automatically when .env exists.
if [ -f ".env" ]; then
  # shellcheck disable=SC1091
  set -a
  . ./.env
  set +a
fi

trim() {
  # Remove leading/trailing spaces.
  printf "%s" "$1" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

to_lower() {
  printf "%s" "$1" | tr '[:upper:]' '[:lower:]'
}

json_escape() {
  printf "%s" "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

fail() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

SERVER_NAME="$(trim "${ORACLE_MCP_SERVER_NAME:-oracle_adb_mcp_server}")"
DESCRIPTION="$(trim "${ORACLE_MCP_DESCRIPTION:-Oracle Autonomous Database MCP server (OAuth)}")"
REMOTE_URL="$(trim "${ORACLE_MCP_REMOTE_URL:-}")"
REGION="$(trim "${ORACLE_ADB_REGION:-}")"
DATABASE_OCID="$(trim "${ORACLE_ADB_DATABASE_OCID:-}")"
ALLOW_HTTP="$(to_lower "$(trim "${ORACLE_MCP_ALLOW_HTTP:-false}")")"

if [ -z "$SERVER_NAME" ]; then
  fail "ORACLE_MCP_SERVER_NAME cannot be empty."
fi

if [ "$ALLOW_HTTP" != "true" ] && [ "$ALLOW_HTTP" != "false" ]; then
  fail "ORACLE_MCP_ALLOW_HTTP must be true or false."
fi

if [ -z "$REMOTE_URL" ]; then
  [ -n "$REGION" ] || fail "ORACLE_ADB_REGION is required when ORACLE_MCP_REMOTE_URL is empty."
  [ -n "$DATABASE_OCID" ] || fail "ORACLE_ADB_DATABASE_OCID is required when ORACLE_MCP_REMOTE_URL is empty."
  REMOTE_URL="https://dataaccess.adb.${REGION}.oraclecloudapps.com/adb/mcp/v1/databases/${DATABASE_OCID}"
fi

case "$REMOTE_URL" in
  https://*) ;;
  http://*)
    if [ "$ALLOW_HTTP" != "true" ]; then
      fail "HTTP URL detected. Set ORACLE_MCP_ALLOW_HTTP=true only for local debug."
    fi
    ;;
  *)
    fail "ORACLE_MCP_REMOTE_URL must start with https:// (or http:// only with ORACLE_MCP_ALLOW_HTTP=true)."
    ;;
esac

SERVER_NAME_ESCAPED="$(json_escape "$SERVER_NAME")"
DESCRIPTION_ESCAPED="$(json_escape "$DESCRIPTION")"
REMOTE_URL_ESCAPED="$(json_escape "$REMOTE_URL")"

if [ "$ALLOW_HTTP" = "true" ]; then
  cat <<EOF
{
  "mcpServers": {
    "${SERVER_NAME_ESCAPED}": {
      "description": "${DESCRIPTION_ESCAPED}",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${REMOTE_URL_ESCAPED}",
        "--allow-http"
      ],
      "transport": "streamable-http"
    }
  }
}
EOF
else
  cat <<EOF
{
  "mcpServers": {
    "${SERVER_NAME_ESCAPED}": {
      "description": "${DESCRIPTION_ESCAPED}",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${REMOTE_URL_ESCAPED}"
      ],
      "transport": "streamable-http"
    }
  }
}
EOF
fi
