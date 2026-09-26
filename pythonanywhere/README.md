# Deploying to PythonAnywhere

This runs as a real always-on process with a real disk, so `mechatrox.db`
just works as a plain file — no Turso/serverless workaround needed.

## 1. Get the code onto PythonAnywhere

Free accounts can't reach github.com directly for `git clone` (outbound
access is whitelisted), but the Files tab lets you upload the two files
in this folder directly:

- Log in to PythonAnywhere → **Files** tab
- Create a folder, e.g. `mechatrox`
- Upload `app.py` and `requirements.txt` from this `pythonanywhere/` folder into it

(If your account has git access — paid tiers do — you can instead open
a **Bash console** and run `git clone https://github.com/dex-os-c/Mechatrox.git`,
then point the web app at `Mechatrox/pythonanywhere/app.py` below.)

## 2. Install dependencies

Open a **Bash console** (Tasks → new console) and run:
```bash
cd mechatrox
pip install --user -r requirements.txt
```

## 3. Create the web app

- **Web** tab → **Add a new web app**
- Choose **Flask**, then the Python version installed (3.10+)
- When it asks for your Flask app's path, point it at `app.py` inside
  the folder you uploaded to (e.g. `/home/yourusername/mechatrox/app.py`)

## 4. Point the WSGI file at this app

PythonAnywhere generates its own WSGI file — open it (linked from the
**Web** tab) and make sure it imports `app` from your uploaded `app.py`,
e.g.:
```python
import sys
path = '/home/yourusername/mechatrox'
if path not in sys.path:
    sys.path.insert(0, path)

from app import app as application
```

## 5. (Optional) change the admin password

Free accounts don't have a way to set custom environment variables from
the dashboard, so the simplest option is editing the two constants
directly in `app.py` before uploading:
```python
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "2k26")
```

## 6. Reload and get your URL

- **Web** tab → **Reload**
- Your API is now live at `https://yourusername.pythonanywhere.com`

## 7. Point the frontend at it

In your **Vercel project** → Settings → Environment Variables, add:
```
VITE_API_BASE_URL = https://yourusername.pythonanywhere.com
```
Then redeploy (Vercel → Deployments → Redeploy) so the frontend picks it up.

## Checking it worked

```bash
curl https://yourusername.pythonanywhere.com/api/health
# {"ok": true}
```

## Backing up / inspecting data directly

`mechatrox.db` sits right next to `app.py` on the server. From a Bash
console: `sqlite3 mechatrox.db "select * from registrations;"` — or
download the file from the **Files** tab with any SQLite viewer.
