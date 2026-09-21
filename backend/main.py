"""
FraudxAI - Backend Root Entrypoint
Allows running 'uvicorn main:app --reload' directly from the 'backend/' directory.
"""

import os
import sys

# Ensure both current directory and parent directory are on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)

for path in [CURRENT_DIR, PARENT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Import FastAPI app from app.main
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
