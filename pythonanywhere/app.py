"""
Mechatrox registration backend for PythonAnywhere.

PythonAnywhere runs this as a real always-on WSGI process with a real
persistent disk, so a plain sqlite3 .db file works exactly as you'd
expect — no serverless workarounds needed. See README.md in this folder
for the exact PythonAnywhere setup steps.

Same request/response shape as the Node versions (api/, server/), so the
frontend's src/lib/api.js doesn't care which one it's talking to.
"""
import json
import os
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "mechatrox.db"

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "2k26")

app = Flask(__name__)
CORS(app)  # wide open on purpose — matches "don't care about security"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS registrations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            team_name   TEXT NOT NULL,
            college     TEXT NOT NULL,
            department  TEXT NOT NULL,
            year        TEXT NOT NULL,
            members     TEXT NOT NULL,
            events      TEXT NOT NULL
        );
        """
    )
    conn.commit()
    conn.close()


init_db()


@app.get("/api/health")
def health():
    return jsonify({"ok": True})


@app.post("/api/registrations")
def create_registration():
    body = request.get_json(silent=True) or {}
    required = ["team_name", "college", "department", "year", "members", "events"]
    if any(k not in body for k in required) or not isinstance(body["members"], list) or not isinstance(body["events"], list):
        return jsonify({"error": "Missing or malformed registration fields."}), 400

    try:
        conn = get_db()
        cur = conn.execute(
            """
            INSERT INTO registrations (team_name, college, department, year, members, events)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                body["team_name"],
                body["college"],
                body["department"],
                body["year"],
                json.dumps(body["members"]),
                json.dumps(body["events"]),
            ),
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return jsonify({"id": str(new_id)}), 201
    except Exception as exc:  # noqa: BLE001 — intentionally broad, this is a low-stakes internal tool
        app.logger.exception(exc)
        return jsonify({"error": "Failed to save registration."}), 500


@app.post("/api/admin/registrations")
def admin_registrations():
    body = request.get_json(silent=True) or {}
    if body.get("username") != ADMIN_USERNAME or body.get("password") != ADMIN_PASSWORD:
        return jsonify({"error": "Invalid credentials."}), 401

    try:
        conn = get_db()
        rows = conn.execute("SELECT * FROM registrations ORDER BY created_at DESC").fetchall()
        conn.close()
        data = [
            {
                **dict(row),
                "members": json.loads(row["members"]),
                "events": json.loads(row["events"]),
            }
            for row in rows
        ]
        return jsonify({"data": data})
    except Exception as exc:  # noqa: BLE001
        app.logger.exception(exc)
        return jsonify({"error": "Failed to read registrations."}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
