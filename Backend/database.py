import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

PROCESS_ENV_KEYS = set(os.environ)


def load_env_file(filename: str, *, override: bool = False) -> None:
    """Load a backend env file without replacing deployment environment variables."""
    env_path = Path(__file__).with_name(filename)

    if not env_path.exists():
        return

    for line in env_path.read_text().splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key in PROCESS_ENV_KEYS:
            continue

        if override or key not in os.environ:
            os.environ[key] = value


# Base values can be shared in .env.  .env.local is gitignored and takes
# precedence for each developer's machine.  Values supplied by the process
# environment (for example Railway/Render secrets) always take precedence.
load_env_file(".env")
load_env_file(".env.local", override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    default_db_path = Path(__file__).resolve().parent / "church.db"
    DATABASE_URL = f"sqlite:///{default_db_path}"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
