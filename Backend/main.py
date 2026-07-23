from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import text
from database import engine
from typing import List
import shutil
import os
import uuid
import json
import logging
import sys
from pathlib import Path


logger = logging.getLogger("lifeline_grace.api")
app = FastAPI()


# =========================
# IMAGE FOLDER
# =========================

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"

if not UPLOAD_FOLDER.exists():
    UPLOAD_FOLDER.mkdir(parents=True)



# MAKE IMAGES AVAILABLE
app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_FOLDER)),
    name="uploads"
)



# =========================
# CORS
# =========================

DEFAULT_FRONTEND_ORIGINS = {
    "https://lifeline-grace-church.vercel.app",
    "https://lifelinegrace.co.ke",
    "https://www.lifelinegrace.co.ke",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}

configured_frontend_origins = {
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
}

# ``FRONTEND_ORIGINS`` extends these safe defaults; it never replaces them.
allow_origins = sorted(DEFAULT_FRONTEND_ORIGINS | configured_frontend_origins)

app.add_middleware(
    CORSMiddleware,
    # Keep local development and the production Vercel site available even
    # when Railway defines FRONTEND_ORIGINS for additional custom domains.
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def log_runtime_configuration() -> None:
    """Make the loaded application and effective CORS policy visible in Railway logs."""
    logger.warning(
        "API startup: module=%s file=%s uvicorn_command=%s "
        "configured_frontend_origins=%s allow_origins=%s",
        __name__,
        Path(__file__).resolve(),
        " ".join(sys.argv),
        sorted(configured_frontend_origins),
        allow_origins,
    )




# =========================
# MODELS
# =========================

class Leader(BaseModel):

    full_name:str
    phone:str
    password:str
    role:str
    department:str
    branch:str
class Member(BaseModel):
    full_name: str
    gender: str
    cell_group: str
    phone: str
    department: str
    username: str
    password: str
    branch_id: int
class MemberUpdate(BaseModel):
    full_name: str
    gender: str
    cell_group: str
    phone: str
    department: str
    username: str
    password: str
class HomeVisitReport(BaseModel):
    branch: str
    cell_group: str
    report_date: str
    members_present: int
    offering: float
    submitted_by: str
    note: str = ""


class Department(BaseModel):

    department_name:str
    description:str
class LiveMediaLink(BaseModel):
    branch: str
    platform: str
    link: str
    uploaded_by: str

class DedicationRecord(BaseModel):
    child_name: str
    date_of_birth: str
    dedication_date: str
    dedication_place: str
    father_name: str
    mother_name: str
    certificate_number: str
    pastor_name: str
    branch: str

def ensure_dedication_records_table():
    id_column = "INTEGER PRIMARY KEY AUTOINCREMENT" if engine.dialect.name == "sqlite" else "SERIAL PRIMARY KEY"
    with engine.begin() as connection:
        connection.execute(text(f"""
            CREATE TABLE IF NOT EXISTS dedication_records (
                id {id_column}, child_name VARCHAR(255) NOT NULL,
                date_of_birth VARCHAR(30) NOT NULL, dedication_date VARCHAR(30) NOT NULL,
                dedication_place VARCHAR(255) NOT NULL, father_name VARCHAR(255) NOT NULL,
                mother_name VARCHAR(255) NOT NULL, certificate_number VARCHAR(100) NOT NULL,
                pastor_name VARCHAR(255) NOT NULL, branch VARCHAR(100) NOT NULL
            )
        """))

@app.get("/dedication-records/{branch}")
def get_dedication_records(branch: str):
    ensure_dedication_records_table()
    with engine.begin() as connection:
        rows = connection.execute(text("SELECT * FROM dedication_records WHERE branch = :branch ORDER BY id DESC"), {"branch": branch}).mappings().all()
    return [dict(row) for row in rows]

@app.post("/dedication-records")
def create_dedication_record(record: DedicationRecord):
    ensure_dedication_records_table()
    with engine.begin() as connection:
        result = connection.execute(text("""
            INSERT INTO dedication_records (child_name, date_of_birth, dedication_date, dedication_place, father_name, mother_name, certificate_number, pastor_name, branch)
            VALUES (:child_name, :date_of_birth, :dedication_date, :dedication_place, :father_name, :mother_name, :certificate_number, :pastor_name, :branch)
        """), record.model_dump())
        record_id = result.lastrowid
    return {"id": record_id, **record.model_dump()}

@app.delete("/dedication-records/{record_id}")
def delete_dedication_record(record_id: int, branch: str):
    """Remove a record after its certificate has been generated."""
    ensure_dedication_records_table()
    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM dedication_records WHERE id = :id AND branch = :branch"),
            {"id": record_id, "branch": branch},
        )
    return {"deleted": result.rowcount > 0}

def ensure_core_tables():
    id_column = (
        "INTEGER PRIMARY KEY AUTOINCREMENT"
        if engine.dialect.name == "sqlite"
        else "SERIAL PRIMARY KEY"
    )

    with engine.begin() as connection:
        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS branches
                (
                    id {id_column},
                    branch_name VARCHAR(100) NOT NULL UNIQUE
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS bishops
                (
                    id {id_column},
                    username VARCHAR(100) NOT NULL UNIQUE,
                    full_name VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    password VARCHAR(255) NOT NULL
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS leaders
                (
                    id {id_column},
                    full_name VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(100) NOT NULL,
                    department VARCHAR(100) NOT NULL,
                    branch VARCHAR(100) NOT NULL
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS members
                (
                    id {id_column},
                    full_name VARCHAR(255) NOT NULL,
                    gender VARCHAR(50),
                    cell_group VARCHAR(100),
                    phone VARCHAR(50),
                    department VARCHAR(100),
                    username VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    branch_id INTEGER NOT NULL
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS departments
                (
                    id {id_column},
                    department_name VARCHAR(255) NOT NULL,
                    description TEXT,
                    branch_id INTEGER
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS announcements
                (
                    id {id_column},
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    department VARCHAR(100),
                    branch VARCHAR(100),
                    posted_by VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS chat_messages
                (
                    id {id_column},
                    sender_name VARCHAR(255) NOT NULL,
                    sender_type VARCHAR(100),
                    department VARCHAR(100),
                    message TEXT NOT NULL,
                    branch VARCHAR(100),
                    reply_to_id INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS house_visit_queue
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    cell_group VARCHAR(100) NOT NULL,
                    round_no INTEGER DEFAULT 1,
                    member_id INTEGER NOT NULL,
                    visit_order INTEGER NOT NULL,
                    status VARCHAR(50) DEFAULT 'Pending'
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS home_visit_reports
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    cell_group VARCHAR(100) NOT NULL,
                    report_date DATE NOT NULL,
                    members_present INTEGER DEFAULT 0,
                    offering NUMERIC DEFAULT 0,
                    submitted_by VARCHAR(255),
                    note TEXT,
                    imported BOOLEAN DEFAULT FALSE,
                    report_generated BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS income
                (
                    id {id_column},
                    income_date DATE NOT NULL,
                    source VARCHAR(255) NOT NULL,
                    description TEXT,
                    amount NUMERIC DEFAULT 0,
                    recorded_by VARCHAR(255),
                    branch VARCHAR(100),
                    report_id INTEGER,
                    report_generated BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS expenses
                (
                    id {id_column},
                    expense_date DATE NOT NULL,
                    category VARCHAR(255) NOT NULL,
                    amount NUMERIC DEFAULT 0,
                    branch VARCHAR(100),
                    recorded_by VARCHAR(255),
                    report_generated BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS branch_gallery
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    image_name VARCHAR(255),
                    image_path VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS home_gallery
                (
                    id {id_column},
                    image_name VARCHAR(255),
                    image_path VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        for branch in ["Bungoma", "Ranje", "Kimilili", "Nairobi", "Matunda"]:
            exists = connection.execute(
                text("SELECT id FROM branches WHERE branch_name = :branch"),
                {"branch": branch},
            ).fetchone()

            if not exists:
                connection.execute(
                    text("INSERT INTO branches (branch_name) VALUES (:branch)"),
                    {"branch": branch},
                )

        bishop_exists = connection.execute(
            text("SELECT id FROM bishops LIMIT 1")
        ).fetchone()

        if not bishop_exists:
            username = os.getenv("DEFAULT_BISHOP_USERNAME", "").strip()
            password = os.getenv("DEFAULT_BISHOP_PASSWORD", "").strip()

            if username and password:
                connection.execute(
                    text("""
                        INSERT INTO bishops
                        (
                            username,
                            full_name,
                            phone,
                            password
                        )
                        VALUES
                        (
                            :username,
                            :full_name,
                            :phone,
                            :password
                        )
                    """),
                    {
                        "username": "".join(username.lower().split()),
                        "full_name": os.getenv(
                            "DEFAULT_BISHOP_FULL_NAME",
                            "Bishop",
                        ),
                        "phone": os.getenv("DEFAULT_BISHOP_PHONE", ""),
                        "password": password,
                    },
                )

def ensure_media_library_table():
    id_column = (
        "INTEGER PRIMARY KEY AUTOINCREMENT"
        if engine.dialect.name == "sqlite"
        else "SERIAL PRIMARY KEY"
    )

    with engine.begin() as connection:
        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS media_library
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    media_type VARCHAR(30) NOT NULL,
                    file_name VARCHAR(255),
                    file_path VARCHAR(255),
                    media_url TEXT,
                    uploaded_by VARCHAR(255),
                    is_live BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )

        # Existing deployments may already have this table without the live
        # state column, so add it without disturbing saved media records.
        add_column_if_missing(
            connection,
            "media_library",
            "is_live",
            "BOOLEAN DEFAULT FALSE",
        )

@app.put("/chat-messages/{message_id}")
def edit_chat_message(message_id: int, message: dict):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                UPDATE chat_messages
                SET message=:message
                WHERE id=:id
            """),
            {
                "id": message_id,
                "message": message["message"],
            },
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Message not found",
            )

    return {"message": "Message updated successfully"}
from fastapi import HTTPException

# ======================================
# SAVE HOME VISIT REPORT
# ======================================

@app.post("/home-visit-reports")
def save_home_visit_report(report: HomeVisitReport):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO home_visit_reports
                (
                    branch,
                    cell_group,
                    report_date,
                    members_present,
                    offering,
                    submitted_by,
                    note
                )
                VALUES
                (
                    :branch,
                    :cell_group,
                    :report_date,
                    :members_present,
                    :offering,
                    :submitted_by,
                    :note
                )
            """),
            {
                "branch": report.branch,
                "cell_group": report.cell_group,
                "report_date": report.report_date,
                "members_present": report.members_present,
                "offering": report.offering,
                "submitted_by": report.submitted_by,
                "note": report.note,
            },
        )

    return {
        "message": "Report submitted successfully"
    }
@app.get("/home-visit-reports/{branch}")
def get_home_visit_reports(branch: str):

    print("Branch received:", branch)

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
    id,
    report_date,
    cell_group,
    members_present,
    offering,
    submitted_by,
    note,
    imported
                FROM home_visit_reports
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                ORDER BY report_date DESC, id DESC
            """),
            {"branch": branch},
        )

        reports = [
           {
    "id": row.id,
    "report_date": str(row.report_date),
    "cell_group": row.cell_group,
    "members_present": row.members_present,
    "offering": float(row.offering),
    "submitted_by": row.submitted_by,
    "note": row.note or "",
    "imported": row.imported,
}
            for row in result
        ]

        return reports


# ======================================
# GET INCOME
# ======================================

@app.get("/income/{branch}")
def get_income(branch: str):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    id,
                    income_date,
                    source,
                    description,
                    amount,
                    recorded_by,
                    branch,
                    report_id,
                    created_at
                FROM income
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                ORDER BY income_date DESC, id DESC
            """),
            {
                "branch": branch,
            },
        )

        return [
            {
                "id": row.id,
                "income_date": str(row.income_date),
                "source": row.source,
                "description": row.description,
                "amount": float(row.amount),
                "recorded_by": row.recorded_by,
                "branch": row.branch,
                "report_id": row.report_id,
                "created_at": str(row.created_at),
            }
            for row in result
        ]
from pydantic import BaseModel
from typing import Optional

class Income(BaseModel):
    income_date: str
    source: str
    description: str
    amount: float
    recorded_by: str
    branch: str
    report_id: Optional[int] = None

@app.post("/income")
def create_income(income: Income):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO income
                (
                    income_date,
                    source,
                    description,
                    amount,
                    recorded_by,
                    branch,
                    report_id
                )
                VALUES
                (
                    :income_date,
                    :source,
                    :description,
                    :amount,
                    :recorded_by,
                    :branch,
                    :report_id
                )
            """),
            {
                "income_date": income.income_date,
                "source": income.source,
                "description": income.description,
                "amount": income.amount,
                "recorded_by": income.recorded_by,
                "branch": income.branch,
                "report_id": income.report_id,
            },
        )

    return {
        "message": "Income saved successfully"
    }
class Expense(BaseModel):
    expense_date: str
    category: str
    amount: float
    branch: str
    recorded_by: Optional[str] = None


class FinancialReportRequest(BaseModel):
    branch: str
    generated_by: str


class BishopOversightReportRequest(BaseModel):
    branch: str
    generated_by: str


def ensure_bishop_oversight_tables():
    id_column = (
        "INTEGER PRIMARY KEY AUTOINCREMENT"
        if engine.dialect.name == "sqlite"
        else "SERIAL PRIMARY KEY"
    )

    with engine.begin() as connection:
        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS bishop_oversight_reports
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    generated_by VARCHAR(255) NOT NULL,
                    total_members INTEGER DEFAULT 0,
                    total_leaders INTEGER DEFAULT 0,
                    total_announcements INTEGER DEFAULT 0,
                    total_media INTEGER DEFAULT 0,
                    total_financial_reports INTEGER DEFAULT 0,
                    total_income NUMERIC DEFAULT 0,
                    total_expenses NUMERIC DEFAULT 0,
                    net_balance NUMERIC DEFAULT 0,
                    total_attendance INTEGER DEFAULT 0,
                    total_cell_offering NUMERIC DEFAULT 0,
                    department_summary TEXT,
                    cell_group_summary TEXT,
                    latest_activity TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )


def add_column_if_missing(connection, table_name: str, column_name: str, column_definition: str):
    if engine.dialect.name == "sqlite":
        existing_columns = connection.execute(
            text(f"PRAGMA table_info({table_name})")
        ).fetchall()

        if any(row.name == column_name for row in existing_columns):
            return

        connection.execute(
            text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}")
        )
        return

    connection.execute(
        text(
            f"""
                ALTER TABLE {table_name}
                ADD COLUMN IF NOT EXISTS {column_name} {column_definition}
            """
        )
    )


def ensure_finance_reporting_tables():
    id_column = (
        "INTEGER PRIMARY KEY AUTOINCREMENT"
        if engine.dialect.name == "sqlite"
        else "SERIAL PRIMARY KEY"
    )
    json_column = "TEXT" if engine.dialect.name == "sqlite" else "JSONB"

    with engine.begin() as connection:
        add_column_if_missing(
            connection,
            "income",
            "report_generated",
            "BOOLEAN DEFAULT FALSE",
        )

        add_column_if_missing(
            connection,
            "expenses",
            "report_generated",
            "BOOLEAN DEFAULT FALSE",
        )

        add_column_if_missing(
            connection,
            "expenses",
            "recorded_by",
            "VARCHAR(255)",
        )

        add_column_if_missing(
            connection,
            "home_visit_reports",
            "report_generated",
            "BOOLEAN DEFAULT FALSE",
        )

        add_column_if_missing(
            connection,
            "home_visit_reports",
            "note",
            "TEXT",
        )

        connection.execute(
            text(f"""
                CREATE TABLE IF NOT EXISTS financial_reports
                (
                    id {id_column},
                    branch VARCHAR(100) NOT NULL,
                    generated_by VARCHAR(255) NOT NULL,
                    period_start DATE,
                    period_end DATE DEFAULT CURRENT_DATE,
                    total_income NUMERIC DEFAULT 0,
                    total_expenses NUMERIC DEFAULT 0,
                    net_balance NUMERIC DEFAULT 0,
                    total_attendance INTEGER DEFAULT 0,
                    total_cell_offering NUMERIC DEFAULT 0,
                    cell_group_summary {json_column},
                    income_summary {json_column},
                    expense_summary {json_column},
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        )


ensure_core_tables()
ensure_finance_reporting_tables()
ensure_bishop_oversight_tables()


def _json_loads(value, fallback):
    if not value:
        return fallback

    if isinstance(value, (list, dict)):
        return value

    try:
        return json.loads(value)
    except Exception:
        return fallback


def normalize_username(username: str) -> str:
    return "".join((username or "").strip().lower().split())


def build_bishop_oversight(branch: str):
    ensure_media_library_table()
    ensure_bishop_oversight_tables()

    with engine.connect() as connection:
        last_report = connection.execute(
            text("""
                SELECT
                    id,
                    branch,
                    generated_by,
                    total_members,
                    total_leaders,
                    total_announcements,
                    total_media,
                    total_financial_reports,
                    total_income,
                    total_expenses,
                    net_balance,
                    total_attendance,
                    total_cell_offering,
                    created_at
                FROM bishop_oversight_reports
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
                LIMIT 1
            """),
            {"branch": branch},
        ).fetchone()

        last_created_at = last_report.created_at if last_report else None

        total_members = connection.execute(
            text("""
                SELECT COUNT(*) AS total
                FROM members m
                JOIN branches b ON m.branch_id = b.id
                WHERE b.branch_name = :branch
            """),
            {"branch": branch},
        ).fetchone().total

        total_leaders = connection.execute(
            text("""
                SELECT COUNT(*) AS total
                FROM leaders
                WHERE branch = :branch
            """),
            {"branch": branch},
        ).fetchone().total

        active_announcements = connection.execute(
            text("""
                SELECT COUNT(*) AS total
                FROM announcements
                WHERE branch = :branch
                AND (:last_created_at IS NULL OR created_at > :last_created_at)
            """),
            {"branch": branch, "last_created_at": last_created_at},
        ).fetchone().total

        active_media = connection.execute(
            text("""
                SELECT COUNT(*) AS total
                FROM media_library
                WHERE branch = :branch
                AND (:last_created_at IS NULL OR created_at > :last_created_at)
            """),
            {"branch": branch, "last_created_at": last_created_at},
        ).fetchone().total

        active_financial_reports = connection.execute(
            text("""
                SELECT
                    COUNT(*) AS report_count,
                    COALESCE(SUM(total_income), 0) AS total_income,
                    COALESCE(SUM(total_expenses), 0) AS total_expenses,
                    COALESCE(SUM(net_balance), 0) AS net_balance,
                    COALESCE(SUM(total_attendance), 0) AS total_attendance,
                    COALESCE(SUM(total_cell_offering), 0) AS total_cell_offering
                FROM financial_reports
                WHERE branch = :branch
                AND (:last_created_at IS NULL OR created_at > :last_created_at)
            """),
            {"branch": branch, "last_created_at": last_created_at},
        ).fetchone()

        current_finance = connection.execute(
            text("""
                SELECT
                    COALESCE((SELECT SUM(amount) FROM income WHERE branch = :branch AND COALESCE(report_generated, FALSE) = FALSE), 0) AS active_income,
                    COALESCE((SELECT SUM(amount) FROM expenses WHERE branch = :branch AND COALESCE(report_generated, FALSE) = FALSE), 0) AS active_expenses,
                    COALESCE((SELECT SUM(members_present) FROM home_visit_reports WHERE branch = :branch AND COALESCE(report_generated, FALSE) = FALSE), 0) AS active_attendance,
                    COALESCE((SELECT SUM(offering) FROM home_visit_reports WHERE branch = :branch AND COALESCE(report_generated, FALSE) = FALSE), 0) AS active_cell_offering
            """),
            {"branch": branch},
        ).fetchone()

        department_rows = connection.execute(
            text("""
                SELECT
                    department,
                    SUM(leaders_count) AS leaders,
                    SUM(members_count) AS members,
                    SUM(announcements_count) AS announcements
                FROM
                (
                    SELECT department, COUNT(*) AS leaders_count, 0 AS members_count, 0 AS announcements_count
                    FROM leaders
                    WHERE branch = :branch
                    GROUP BY department

                    UNION ALL

                    SELECT m.department, 0 AS leaders_count, COUNT(*) AS members_count, 0 AS announcements_count
                    FROM members m
                    JOIN branches b ON m.branch_id = b.id
                    WHERE b.branch_name = :branch
                    GROUP BY m.department

                    UNION ALL

                    SELECT department, 0 AS leaders_count, 0 AS members_count, COUNT(*) AS announcements_count
                    FROM announcements
                    WHERE branch = :branch
                    AND (:last_created_at IS NULL OR created_at > :last_created_at)
                    GROUP BY department
                ) department_activity
                WHERE department IS NOT NULL AND department <> ''
                GROUP BY department
                ORDER BY department
            """),
            {"branch": branch, "last_created_at": last_created_at},
        )

        cell_rows = connection.execute(
            text("""
                SELECT
                    m.cell_group,
                    COUNT(*) AS members
                FROM members m
                JOIN branches b ON m.branch_id = b.id
                WHERE b.branch_name = :branch
                AND m.cell_group IS NOT NULL
                AND m.cell_group <> ''
                GROUP BY m.cell_group
                ORDER BY members DESC, m.cell_group
            """),
            {"branch": branch},
        )

        latest_announcements = connection.execute(
            text("""
                SELECT title, department, posted_by, created_at
                FROM announcements
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
                LIMIT 5
            """),
            {"branch": branch},
        )

        latest_media = connection.execute(
            text("""
                SELECT title, media_type, uploaded_by, created_at
                FROM media_library
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
                LIMIT 5
            """),
            {"branch": branch},
        )

        recent_financial_reports = connection.execute(
            text("""
                SELECT id, generated_by, total_income, total_expenses, net_balance, created_at
                FROM financial_reports
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
                LIMIT 5
            """),
            {"branch": branch},
        )

    department_summary = [
        {
            "department": row.department,
            "leaders": int(row.leaders or 0),
            "members": int(row.members or 0),
            "announcements": int(row.announcements or 0),
        }
        for row in department_rows
    ]

    cell_group_summary = [
        {
            "cell_group": row.cell_group,
            "members": int(row.members or 0),
        }
        for row in cell_rows
    ]

    recent_activity = {
        "announcements": [
            {
                "title": row.title,
                "department": row.department,
                "posted_by": row.posted_by,
                "created_at": str(row.created_at),
            }
            for row in latest_announcements
        ],
        "media": [
            {
                "title": row.title,
                "media_type": row.media_type,
                "uploaded_by": row.uploaded_by,
                "created_at": str(row.created_at),
            }
            for row in latest_media
        ],
        "financial_reports": [
            {
                "id": row.id,
                "generated_by": row.generated_by,
                "total_income": float(row.total_income or 0),
                "total_expenses": float(row.total_expenses or 0),
                "net_balance": float(row.net_balance or 0),
                "created_at": str(row.created_at),
            }
            for row in recent_financial_reports
        ],
    }

    active_income = float(current_finance.active_income or 0)
    active_expenses = float(current_finance.active_expenses or 0)

    return {
        "branch": branch,
        "last_report": (
            {
                "id": last_report.id,
                "generated_by": last_report.generated_by,
                "created_at": str(last_report.created_at),
                "net_balance": float(last_report.net_balance or 0),
            }
            if last_report
            else None
        ),
        "totals": {
            "members": int(total_members or 0),
            "leaders": int(total_leaders or 0),
            "active_announcements": int(active_announcements or 0),
            "active_media": int(active_media or 0),
            "active_financial_reports": int(active_financial_reports.report_count or 0),
            "stored_income": float(active_financial_reports.total_income or 0),
            "stored_expenses": float(active_financial_reports.total_expenses or 0),
            "stored_net_balance": float(active_financial_reports.net_balance or 0),
            "active_income": active_income,
            "active_expenses": active_expenses,
            "active_net_balance": active_income - active_expenses,
            "attendance": int(active_financial_reports.total_attendance or 0)
            + int(current_finance.active_attendance or 0),
            "cell_offering": float(active_financial_reports.total_cell_offering or 0)
            + float(current_finance.active_cell_offering or 0),
        },
        "department_summary": department_summary,
        "cell_group_summary": cell_group_summary,
        "recent_activity": recent_activity,
    }


@app.get("/bishop-oversight/{branch}")
def get_bishop_oversight(branch: str):
    return build_bishop_oversight(branch)


@app.get("/bishop-oversight-reports/{branch}")
def get_bishop_oversight_reports(branch: str):
    ensure_bishop_oversight_tables()

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    id,
                    branch,
                    generated_by,
                    total_members,
                    total_leaders,
                    total_announcements,
                    total_media,
                    total_financial_reports,
                    total_income,
                    total_expenses,
                    net_balance,
                    total_attendance,
                    total_cell_offering,
                    department_summary,
                    cell_group_summary,
                    latest_activity,
                    created_at
                FROM bishop_oversight_reports
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
            """),
            {"branch": branch},
        )

        return [
            {
                "id": row.id,
                "branch": row.branch,
                "generated_by": row.generated_by,
                "total_members": row.total_members,
                "total_leaders": row.total_leaders,
                "total_announcements": row.total_announcements,
                "total_media": row.total_media,
                "total_financial_reports": row.total_financial_reports,
                "total_income": float(row.total_income or 0),
                "total_expenses": float(row.total_expenses or 0),
                "net_balance": float(row.net_balance or 0),
                "total_attendance": row.total_attendance,
                "total_cell_offering": float(row.total_cell_offering or 0),
                "department_summary": _json_loads(row.department_summary, []),
                "cell_group_summary": _json_loads(row.cell_group_summary, []),
                "latest_activity": _json_loads(row.latest_activity, {}),
                "created_at": str(row.created_at),
            }
            for row in result
        ]


@app.post("/bishop-oversight-reports/generate")
def generate_bishop_oversight_report(report_request: BishopOversightReportRequest):
    overview = build_bishop_oversight(report_request.branch)
    totals = overview["totals"]

    total_income = totals["stored_income"] + totals["active_income"]
    total_expenses = totals["stored_expenses"] + totals["active_expenses"]
    net_balance = total_income - total_expenses

    with engine.begin() as connection:
        insert_report_sql = """
                INSERT INTO bishop_oversight_reports
                (
                    branch,
                    generated_by,
                    total_members,
                    total_leaders,
                    total_announcements,
                    total_media,
                    total_financial_reports,
                    total_income,
                    total_expenses,
                    net_balance,
                    total_attendance,
                    total_cell_offering,
                    department_summary,
                    cell_group_summary,
                    latest_activity
                )
                VALUES
                (
                    :branch,
                    :generated_by,
                    :total_members,
                    :total_leaders,
                    :total_announcements,
                    :total_media,
                    :total_financial_reports,
                    :total_income,
                    :total_expenses,
                    :net_balance,
                    :total_attendance,
                    :total_cell_offering,
                    :department_summary,
                    :cell_group_summary,
                    :latest_activity
                )
        """

        if engine.dialect.name != "sqlite":
            insert_report_sql += " RETURNING id"

        saved_report = connection.execute(
            text(insert_report_sql),
            {
                "branch": report_request.branch,
                "generated_by": report_request.generated_by,
                "total_members": totals["members"],
                "total_leaders": totals["leaders"],
                "total_announcements": totals["active_announcements"],
                "total_media": totals["active_media"],
                "total_financial_reports": totals["active_financial_reports"],
                "total_income": total_income,
                "total_expenses": total_expenses,
                "net_balance": net_balance,
                "total_attendance": totals["attendance"],
                "total_cell_offering": totals["cell_offering"],
                "department_summary": json.dumps(overview["department_summary"]),
                "cell_group_summary": json.dumps(overview["cell_group_summary"]),
                "latest_activity": json.dumps(overview["recent_activity"]),
            },
        )

        saved_report_id = (
            saved_report.fetchone().id
            if engine.dialect.name != "sqlite"
            else saved_report.lastrowid
        )

    return {
        "message": "Bishop oversight report generated successfully",
        "report_id": saved_report_id,
        "net_balance": net_balance,
    }


@app.post("/expenses")
def create_expense(expense: Expense):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO expenses
                (
                    expense_date,
                    category,
                    amount,
                    branch,
                    recorded_by
                )
                VALUES
                (
                    :expense_date,
                    :category,
                    :amount,
                    :branch,
                    :recorded_by
                )
            """),
            {
                "expense_date": expense.expense_date,
                "category": expense.category,
                "amount": expense.amount,
                "branch": expense.branch,
                "recorded_by": expense.recorded_by,
            },
        )

    return {
        "message": "Expense saved successfully"
    }
@app.get("/expenses/{branch}")
def get_expenses(branch: str):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    id,
                    expense_date,
                    category,
                    amount,
                    recorded_by
                FROM expenses
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                ORDER BY expense_date DESC, id DESC
            """),
            {
                "branch": branch,
            },
        )

        return [
            {
                "id": row.id,
                "expense_date": str(row.expense_date),
                "category": row.category,
                "amount": float(row.amount),
                "recorded_by": row.recorded_by,
            }
            for row in result
        ]


@app.get("/financial-reports/{branch}")
def get_financial_reports(branch: str):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    id,
                    branch,
                    generated_by,
                    period_start,
                    period_end,
                    total_income,
                    total_expenses,
                    net_balance,
                    total_attendance,
                    total_cell_offering,
                    cell_group_summary,
                    income_summary,
                    expense_summary,
                    created_at
                FROM financial_reports
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
            """),
            {"branch": branch},
        )

        return [
            {
                "id": row.id,
                "branch": row.branch,
                "generated_by": row.generated_by,
                "period_start": str(row.period_start) if row.period_start else "",
                "period_end": str(row.period_end) if row.period_end else "",
                "total_income": float(row.total_income),
                "total_expenses": float(row.total_expenses),
                "net_balance": float(row.net_balance),
                "total_attendance": row.total_attendance,
                "total_cell_offering": float(row.total_cell_offering),
                "cell_group_summary": row.cell_group_summary or [],
                "income_summary": row.income_summary or [],
                "expense_summary": row.expense_summary or [],
                "created_at": str(row.created_at),
            }
            for row in result
        ]


@app.post("/financial-reports/generate")
def generate_financial_report(report_request: FinancialReportRequest):

    with engine.begin() as connection:

        totals = connection.execute(
            text("""
                SELECT
                    COALESCE((
                        SELECT SUM(amount)
                        FROM income
                        WHERE branch = :branch
                        AND COALESCE(report_generated, FALSE) = FALSE
                    ), 0) AS total_income,
                    COALESCE((
                        SELECT SUM(amount)
                        FROM expenses
                        WHERE branch = :branch
                        AND COALESCE(report_generated, FALSE) = FALSE
                    ), 0) AS total_expenses,
                    COALESCE((
                        SELECT SUM(members_present)
                        FROM home_visit_reports
                        WHERE branch = :branch
                        AND COALESCE(report_generated, FALSE) = FALSE
                    ), 0) AS total_attendance,
                    COALESCE((
                        SELECT SUM(offering)
                        FROM home_visit_reports
                        WHERE branch = :branch
                        AND COALESCE(report_generated, FALSE) = FALSE
                    ), 0) AS total_cell_offering
            """),
            {"branch": report_request.branch},
        ).fetchone()

        period = connection.execute(
            text("""
                SELECT MIN(period_date) AS period_start
                FROM
                (
                    SELECT income_date AS period_date
                    FROM income
                    WHERE branch = :branch
                    AND COALESCE(report_generated, FALSE) = FALSE

                    UNION ALL

                    SELECT expense_date AS period_date
                    FROM expenses
                    WHERE branch = :branch
                    AND COALESCE(report_generated, FALSE) = FALSE

                    UNION ALL

                    SELECT report_date AS period_date
                    FROM home_visit_reports
                    WHERE branch = :branch
                    AND COALESCE(report_generated, FALSE) = FALSE
                ) active_period
            """),
            {"branch": report_request.branch},
        ).fetchone()

        cell_rows = connection.execute(
            text("""
                SELECT
                    cell_group,
                    COUNT(*) AS submissions,
                    COALESCE(SUM(members_present), 0) AS attendance,
                    COALESCE(SUM(offering), 0) AS offering
                FROM home_visit_reports
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                GROUP BY cell_group
                ORDER BY attendance DESC, cell_group
            """),
            {"branch": report_request.branch},
        )

        income_rows = connection.execute(
            text("""
                SELECT
                    source,
                    COUNT(*) AS records,
                    COALESCE(SUM(amount), 0) AS amount
                FROM income
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                GROUP BY source
                ORDER BY amount DESC, source
            """),
            {"branch": report_request.branch},
        )

        expense_rows = connection.execute(
            text("""
                SELECT
                    category,
                    COUNT(*) AS records,
                    COALESCE(SUM(amount), 0) AS amount
                FROM expenses
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
                GROUP BY category
                ORDER BY amount DESC, category
            """),
            {"branch": report_request.branch},
        )

        cell_group_summary = [
            {
                "cell_group": row.cell_group,
                "submissions": row.submissions,
                "attendance": row.attendance,
                "offering": float(row.offering),
            }
            for row in cell_rows
        ]

        income_summary = [
            {
                "source": row.source,
                "records": row.records,
                "amount": float(row.amount),
            }
            for row in income_rows
        ]

        expense_summary = [
            {
                "category": row.category,
                "records": row.records,
                "amount": float(row.amount),
            }
            for row in expense_rows
        ]

        total_income = float(totals.total_income)
        total_expenses = float(totals.total_expenses)
        net_balance = total_income - total_expenses

        saved_report = connection.execute(
            text("""
                INSERT INTO financial_reports
                (
                    branch,
                    generated_by,
                    period_start,
                    period_end,
                    total_income,
                    total_expenses,
                    net_balance,
                    total_attendance,
                    total_cell_offering,
                    cell_group_summary,
                    income_summary,
                    expense_summary
                )
                VALUES
                (
                    :branch,
                    :generated_by,
                    :period_start,
                    CURRENT_DATE,
                    :total_income,
                    :total_expenses,
                    :net_balance,
                    :total_attendance,
                    :total_cell_offering,
                    CAST(:cell_group_summary AS JSONB),
                    CAST(:income_summary AS JSONB),
                    CAST(:expense_summary AS JSONB)
                )
                RETURNING id
            """),
            {
                "branch": report_request.branch,
                "generated_by": report_request.generated_by,
                "period_start": period.period_start,
                "total_income": total_income,
                "total_expenses": total_expenses,
                "net_balance": net_balance,
                "total_attendance": totals.total_attendance,
                "total_cell_offering": float(totals.total_cell_offering),
                "cell_group_summary": json.dumps(cell_group_summary),
                "income_summary": json.dumps(income_summary),
                "expense_summary": json.dumps(expense_summary),
            },
        ).fetchone()

        connection.execute(
            text("""
                UPDATE income
                SET report_generated = TRUE
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
            """),
            {"branch": report_request.branch},
        )

        connection.execute(
            text("""
                UPDATE expenses
                SET report_generated = TRUE
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
            """),
            {"branch": report_request.branch},
        )

        connection.execute(
            text("""
                UPDATE home_visit_reports
                SET report_generated = TRUE
                WHERE branch = :branch
                AND COALESCE(report_generated, FALSE) = FALSE
            """),
            {"branch": report_request.branch},
        )

        if net_balance != 0:
            connection.execute(
                text("""
                    INSERT INTO income
                    (
                        income_date,
                        source,
                        description,
                        amount,
                        recorded_by,
                        branch,
                        report_generated
                    )
                    VALUES
                    (
                        CURRENT_DATE,
                        'Balance Brought Forward',
                        'Balance carried forward from generated finance report',
                        :amount,
                        :recorded_by,
                        :branch,
                        FALSE
                    )
                """),
                {
                    "amount": net_balance,
                    "recorded_by": report_request.generated_by,
                    "branch": report_request.branch,
                },
            )

    return {
        "message": "Financial report generated successfully",
        "report_id": saved_report.id,
        "net_balance": net_balance,
    }
# ======================================
# IMPORT REPORT TO INCOME
# ======================================

@app.post("/home-visit-reports/import/{report_id}")
def import_home_visit_report(report_id: int, data: dict):

    with engine.begin() as connection:

        report = connection.execute(
            text("""
                SELECT
                    id,
                    report_date,
                    cell_group,
                    offering,
                    branch,
                    imported
                FROM home_visit_reports
                WHERE id = :id
            """),
            {"id": report_id},
        ).fetchone()

        if report is None:
            raise HTTPException(
                status_code=404,
                detail="Report not found",
            )

        if report.imported:
            raise HTTPException(
                status_code=400,
                detail="Report already imported",
            )

        connection.execute(
            text("""
                INSERT INTO income
                (
                    income_date,
                    source,
                    description,
                    amount,
                    recorded_by,
                    branch,
                    report_id
                )
                VALUES
                (
                    :income_date,
                    :source,
                    :description,
                    :amount,
                    :recorded_by,
                    :branch,
                    :report_id
                )
            """),
            {
                "income_date": report.report_date,
                "source": "House Visit",
                "description": report.cell_group,
                "amount": report.offering,
                "recorded_by": data["recorded_by"],
                "branch": report.branch,
                "report_id": report.id,
            },
        )

        connection.execute(
            text("""
                UPDATE home_visit_reports
                SET imported = TRUE
                WHERE id = :id
            """),
            {"id": report.id},
        )

    return {"message": "Report imported successfully"}
# =========================
# REGISTER MEMBER
# =========================

@app.post("/members")
def register_member(member: Member):

    with engine.begin() as connection:

        # First choice: first name
        username = normalize_username(member.username)

        # Check if it exists
        exists = connection.execute(
            text("""
                SELECT id
                FROM members
                WHERE LOWER(REPLACE(TRIM(username), ' ', ''))=:username
            """),
            {"username": username},
        ).fetchone()

        # If first name already exists, use surname
        if exists:

            names = member.full_name.strip().split()

            if len(names) > 1:
                username = normalize_username(names[-1])
            else:
                username = username + "1"

            exists = connection.execute(
                text("""
                    SELECT id
                    FROM members
                    WHERE LOWER(REPLACE(TRIM(username), ' ', ''))=:username
                """),
                {"username": username},
            ).fetchone()

            # If surname also exists, add numbers
            counter = 1

            while exists:
                new_username = f"{username}{counter}"

                exists = connection.execute(
                    text("""
                        SELECT id
                        FROM members
                        WHERE LOWER(REPLACE(TRIM(username), ' ', ''))=:username
                    """),
                    {"username": new_username},
                ).fetchone()

                if not exists:
                    username = new_username
                    break

                counter += 1

        connection.execute(
            text("""
                INSERT INTO members
                (
                    full_name,
                    phone,
                    gender,
                    branch_id,
                    cell_group,
                    username,
                    department,
                    password
                )

                VALUES
                (
                    :full_name,
                    :phone,
                    :gender,
                    :branch_id,
                    :cell_group,
                    :username,
                    :department,
                    :password
                )
            """),
            {
                "full_name": member.full_name,
                "phone": member.phone,
                "gender": member.gender,
                "branch_id": member.branch_id,
                "cell_group": member.cell_group,
                "username": username,
                "department": member.department,
                "password": member.password,
            },
        )

    return {
        "message": "Member registered successfully",
        "username": username,
    }

@app.get("/branch-members/{branch}")
def get_branch_members(branch: str):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    m.id,
                    m.full_name,
                    m.gender,
                    m.cell_group,
                    m.phone,
                    m.department,
                    m.username,
                    m.password,
                    m.branch_id
                FROM members m
                JOIN branches b
                    ON m.branch_id = b.id
                WHERE b.branch_name = :branch
                ORDER BY m.full_name
            """),
            {
                "branch": branch,
            },
        )

        return [
            {
                "id": row.id,
                "full_name": row.full_name,
                "gender": row.gender,
                "cell_group": row.cell_group,
                "phone": row.phone,
                "department": row.department,
                "username": row.username,
                "password": row.password,
                "branch_id": row.branch_id,
            }
            for row in result
        ]

@app.put("/members/{member_id}")
def update_member(member_id: int, member: MemberUpdate):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                UPDATE members
                SET
                    full_name=:full_name,
                    gender=:gender,
                    cell_group=:cell_group,
                    phone=:phone,
                    department=:department,
                    username=:username,
                    password=:password
                WHERE id=:id
            """),
            {
                "id": member_id,
                "full_name": member.full_name,
                "gender": member.gender,
                "cell_group": member.cell_group,
                "phone": member.phone,
                "department": member.department,
                "username": normalize_username(member.username),
                "password": member.password,
            },
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Member not found",
            )

    return {"message": "Member updated successfully"}

@app.delete("/members/{member_id}")
def delete_member(member_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                DELETE FROM members
                WHERE id=:id
            """),
            {
                "id": member_id,
            },
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Member not found",
            )

    return {"message": "Member deleted successfully"}
class MemberLogin(BaseModel):
    username: str
    password: str


class BishopLogin(BaseModel):
    username: str
    password: str

    # =========================
# BISHOP LOGIN
# =========================

@app.post("/bishop-login")
def bishop_login(bishop: BishopLogin):

    with engine.connect() as connection:

        result = connection.execute(

            text("""
                SELECT
                    id,
                    username,
                    full_name,
                    phone,
                    password

                FROM bishops

                WHERE LOWER(REPLACE(TRIM(username), ' ', ''))=:username
            """),

            {
                "username": normalize_username(bishop.username)
            }

        ).fetchone()

    if result is None:

        return {
            "message": "Invalid username or password"
        }

    if result.password != bishop.password:

        return {
            "message": "Invalid username or password"
        }

    return {

        "message": "Login successful",

        "bishop":{

            "id":result.id,
            "username":result.username,
            "full_name":result.full_name,
            "phone":result.phone

        }

    }
@app.post("/upload-chat-file")
async def upload_chat_file(
    file: UploadFile = File(...),
    sender_name: str = Form(...),
    sender_type: str = Form(...),
    department: str = Form(...),
    branch: str = Form(...),
):

    filename = str(uuid.uuid4()) + "_" + file.filename

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extension = file.filename.split(".")[-1].lower()

    if extension in ["jpg", "jpeg", "png", "gif", "webp"]:
        message = f"[IMAGE]{filename}"

    elif extension in ["mp4", "mov", "avi", "mkv", "webm"]:
        message = f"[VIDEO]{filename}"

    elif extension in ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]:
        message = f"[FILE]{filename}|{file.filename}"

    else:
        message = f"[FILE]{filename}|{file.filename}"

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO chat_messages
                (
                    sender_name,
                    sender_type,
                    department,
                    message,
                    branch
                )
                VALUES
                (
                    :sender_name,
                    :sender_type,
                    :department,
                    :message,
                    :branch
                )
            """),
            {
                "sender_name": sender_name,
                "sender_type": sender_type,
                "department": department,
                "message": message,
                "branch": branch,
            },
        )

    return {
        "message": "File uploaded successfully"
    }

# =========================
# MEDIA LIBRARY
# =========================

@app.get("/media-library/live-status")
def get_live_media_status():
    ensure_media_library_table()

    with engine.connect() as connection:
        live_media = connection.execute(
            text("""
                SELECT
                    title,
                    media_url
                FROM media_library
                WHERE media_type = 'live'
                  AND COALESCE(is_live, FALSE) = TRUE
                  AND media_url IS NOT NULL
                  AND media_url <> ''
                ORDER BY created_at DESC, id DESC
                LIMIT 1
            """)
        ).fetchone()

    if not live_media:
        return {"is_live": False, "platform": "", "link": ""}

    platform = live_media.title.replace(" Live Stream", "")

    return {
        "is_live": True,
        "platform": platform,
        "link": live_media.media_url,
    }


@app.get("/media-library/{branch}")
def get_media_library(branch: str):
    ensure_media_library_table()

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    id,
                    branch,
                    title,
                    media_type,
                    file_name,
                    file_path,
                    media_url,
                    uploaded_by,
                    created_at
                FROM media_library
                WHERE branch = :branch
                ORDER BY created_at DESC, id DESC
            """),
            {"branch": branch},
        )

        return [
            {
                "id": row.id,
                "branch": row.branch,
                "title": row.title,
                "media_type": row.media_type,
                "file_name": row.file_name,
                "file_path": row.file_path,
                "media_url": row.media_url,
                "uploaded_by": row.uploaded_by,
                "created_at": str(row.created_at),
            }
            for row in result
        ]


@app.post("/media-library/upload")
async def upload_media_library(
    branch: str = Form(...),
    title: str = Form(...),
    uploaded_by: str = Form(...),
    files: List[UploadFile] = File(...),
):
    ensure_media_library_table()

    image_extensions = ["jpg", "jpeg", "png", "gif", "webp"]
    video_extensions = ["mp4", "mov", "avi", "mkv", "webm"]

    with engine.begin() as connection:
        for file in files:
            filename = str(uuid.uuid4()) + "_" + file.filename
            file_path = os.path.join(UPLOAD_FOLDER, filename)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            extension = file.filename.split(".")[-1].lower()
            media_type = "image" if extension in image_extensions else "video"

            if extension not in image_extensions + video_extensions:
                media_type = "file"

            connection.execute(
                text("""
                    INSERT INTO media_library
                    (
                        branch,
                        title,
                        media_type,
                        file_name,
                        file_path,
                        uploaded_by
                    )
                    VALUES
                    (
                        :branch,
                        :title,
                        :media_type,
                        :file_name,
                        :file_path,
                        :uploaded_by
                    )
                """),
                {
                    "branch": branch,
                    "title": title,
                    "media_type": media_type,
                    "file_name": file.filename,
                    "file_path": filename,
                    "uploaded_by": uploaded_by,
                },
            )

    return {"message": "Media uploaded successfully"}


@app.post("/media-library/live-link")
def save_live_media_link(media: LiveMediaLink):
    ensure_media_library_table()

    with engine.begin() as connection:
        connection.execute(
            text("""
                UPDATE media_library
                SET is_live = FALSE
                WHERE media_type = 'live'
            """)
        )

        connection.execute(
            text("""
                INSERT INTO media_library
                (
                    branch,
                    title,
                    media_type,
                    media_url,
                    uploaded_by,
                    is_live
                )
                VALUES
                (
                    :branch,
                    :title,
                    :media_type,
                    :media_url,
                    :uploaded_by,
                    TRUE
                )
            """),
            {
                "branch": media.branch,
                "title": media.platform + " Live Stream",
                "media_type": "live",
                "media_url": media.link,
                "uploaded_by": media.uploaded_by,
            },
        )

    return {"message": "Live stream link saved"}


@app.post("/media-library/live-status/stop")
def stop_live_media():
    ensure_media_library_table()

    with engine.begin() as connection:
        connection.execute(
            text("""
                UPDATE media_library
                SET is_live = FALSE
                WHERE media_type = 'live'
                  AND COALESCE(is_live, FALSE) = TRUE
            """)
        )

    return {"message": "Live stream ended"}


@app.delete("/media-library/{media_id}")
def delete_media_library_item(media_id: int):
    ensure_media_library_table()

    with engine.begin() as connection:
        media = connection.execute(
            text("""
                SELECT file_path
                FROM media_library
                WHERE id = :id
            """),
            {"id": media_id},
        ).fetchone()

        if media and media.file_path:
            file_path = os.path.join(UPLOAD_FOLDER, media.file_path)

            if os.path.exists(file_path):
                os.remove(file_path)

        connection.execute(
            text("""
                DELETE FROM media_library
                WHERE id = :id
            """),
            {"id": media_id},
        )

    return {"message": "Media item deleted"}
#=========================
# MEMBER LOGIN
# =========================
@app.post("/member-login")
def member_login(member: MemberLogin):

    with engine.connect() as connection:

        result = connection.execute(

            text("""
                SELECT
                    id,
                    full_name,
                    username,
                    password,
                    department,
                    branch_id,
                    cell_group

                FROM members

                WHERE LOWER(REPLACE(TRIM(username), ' ', '')) = :username
                AND password = :password
            """),

            {
                "username": normalize_username(member.username),
                "password": member.password,
            }

        ).fetchone()

    if result is None:
        return {
            "message": "Invalid username or password"
        }

    return {
        "message": "Login successful",
        "id": result.id,
        "full_name": result.full_name,
        "username": result.username,
        "department": result.department,
        "branch_id": result.branch_id,
        "cell_group": result.cell_group,
    }
# =========================
# HOME
# =========================

@app.get("/")
def home():

    return {
        "message":"Church Management API Running"
    }


@app.get("/health")
def health_check():
    """Report healthy only when the configured database is reachable."""
    try:
        with engine.connect() as connection:
            if engine.dialect.name == "postgresql":
                database_name = connection.execute(
                    text("SELECT current_database()")
                ).scalar_one()
            else:
                connection.execute(text("SELECT 1"))
                database_name = "sqlite"
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail="Database connection is unavailable",
        ) from error

    return {
        "status": "ok",
        "database": engine.dialect.name,
        "database_name": database_name,
    }


@app.get("/cors-debug")
async def cors_debug(request: Request):
    """Temporary endpoint for inspecting proxy-forwarded CORS request headers."""
    return {
        "origin": request.headers.get("origin"),
        "host": request.headers.get("host"),
        "referer": request.headers.get("referer"),
    }





# =========================
# GET LEADERS
# =========================

@app.get("/leaders")
def get_leaders():

    with engine.connect() as connection:

        result = connection.execute(

            text("""
            SELECT
            id,
            full_name,
            phone,
            password,
            role,
            department,
            branch

            FROM leaders

            ORDER BY id
            """)

        )


        return [

            {
            "id":row.id,
            "full_name":row.full_name,
            "phone":row.phone,
            "password":row.password,
            "role":row.role,
            "department":row.department,
            "branch":row.branch
            }

            for row in result

        ]




# =========================
# CREATE LEADER
# =========================

@app.post("/leaders")
def create_leader(leader: Leader):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO leaders
                (
                    full_name,
                    phone,
                    password,
                    role,
                    department,
                    branch
                )
                VALUES
                (
                    :full_name,
                    :phone,
                    :password,
                    :role,
                    :department,
                    :branch
                )
            """),
            {
                "full_name": leader.full_name,
                "phone": leader.phone,
                "password": leader.password,
                "role": leader.role,
                "department": leader.department,
                "branch": leader.branch,
            },
        )

    return {"message": "Leader created successfully"}


# =========================
# UPDATE LEADER
# =========================

@app.put("/leaders/{leader_id}")
def update_leader(leader_id: int, leader: Leader):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                UPDATE leaders
                SET
                    full_name=:full_name,
                    phone=:phone,
                    password=:password,
                    role=:role,
                    department=:department,
                    branch=:branch
                WHERE id=:id
            """),
            {
                "id": leader_id,
                "full_name": leader.full_name,
                "phone": leader.phone,
                "password": leader.password,
                "role": leader.role,
                "department": leader.department,
                "branch": leader.branch,
            },
        )

        if result.rowcount == 0:
            return {"message": "Leader not found"}

    return {"message": "Leader updated successfully"}


# =========================
# DELETE LEADER
# =========================

@app.delete("/leaders/{leader_id}")
def delete_leader(leader_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                DELETE FROM leaders
                WHERE id=:id
            """),
            {
                "id": leader_id
            },
        )

        if result.rowcount == 0:
            return {"message": "Leader not found"}

    return {"message": "Leader deleted successfully"}

class Announcement(BaseModel):
    title: str
    message: str
    department: str
    branch: str
    posted_by: str
# ======================================
# ANNOUNCEMENTS
# ======================================

@app.get("/announcements")
def get_announcements():

    with engine.connect() as connection:

        result = connection.execute(text("""
            SELECT
                id,
                title,
                message,
                department,
                branch,
                posted_by,
                created_at
            FROM announcements
            ORDER BY id DESC
        """))

        return [
            {
                "id": row.id,
                "title": row.title,
                "message": row.message,
                "department": row.department,
                "branch": row.branch,
                "posted_by": row.posted_by,
                "created_at": str(row.created_at),
            }
            for row in result
        ]


@app.post("/announcements")
def create_announcement(announcement: Announcement):

    with engine.begin() as connection:

        # Save announcement
        connection.execute(
            text("""
                INSERT INTO announcements
                (
                    title,
                    message,
                    department,
                    branch,
                    posted_by
                )
                VALUES
                (
                    :title,
                    :message,
                    :department,
                    :branch,
                    :posted_by
                )
            """),
            {
                "title": announcement.title,
                "message": announcement.message,
                "department": announcement.department,
                "branch": announcement.branch,
                "posted_by": announcement.posted_by,
            },
        )

        # ONLY Administration announcements go to church group chat
        if announcement.department == "Administration":

            connection.execute(
                text("""
                    INSERT INTO chat_messages
                    (
                        sender_name,
                        sender_type,
                        department,
                        message,
                        branch
                    )
                    VALUES
                    (
                        :sender_name,
                        :sender_type,
                        :department,
                        :message,
                        :branch
                    )
                """),
                {
                    "sender_name": announcement.posted_by,
                    "sender_type": "Announcement",
                    "department": announcement.department,
                    "message": "📢 " + announcement.title + "\n\n" + announcement.message,
                    "branch": announcement.branch,
                },
            )

    return {
        "message": "Announcement posted successfully"
    }

@app.put("/announcements/{announcement_id}")
def update_announcement(
    announcement_id: int,
    announcement: Announcement,
):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                UPDATE announcements
                SET
                    title=:title,
                    message=:message,
                    department=:department,
                    branch=:branch,
                    posted_by=:posted_by
                WHERE id=:id
            """),
            {
                "id": announcement_id,
                "title": announcement.title,
                "message": announcement.message,
                "department": announcement.department,
                "branch": announcement.branch,
                "posted_by": announcement.posted_by,
            },
        )

        if result.rowcount == 0:
            return {"message": "Announcement not found"}

    return {"message": "Announcement updated successfully"}


@app.delete("/announcements/{announcement_id}")
def delete_announcement(announcement_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                DELETE FROM announcements
                WHERE id=:id
            """),
            {"id": announcement_id},
        )

        if result.rowcount == 0:
            return {"message": "Announcement not found"}

    return {"message": "Announcement deleted successfully"}
class ChatMessage(BaseModel):
    sender_name: str
    sender_type: str
    department: str
    message: str
    branch: str
    reply_to_id: int | None = None


class HouseVisitMember(BaseModel):
    member_id: int
    visit_order: int

class HouseVisitStatus(BaseModel):
    status: str

class HouseVisitRound(BaseModel):
    branch: str
    cell_group: str
    round_no: int
    members: list[HouseVisitMember]
# ======================================
# UPDATE HOUSE VISIT STATUS
# ======================================

@app.patch("/house-visit-queue/{queue_id}/status")
def update_house_visit_status(
    queue_id: int,
    data: HouseVisitStatus,
):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                UPDATE house_visit_queue
                SET status = :status
                WHERE id = :id
            """),
            {
                "id": queue_id,
                "status": data.status,
            },
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Queue item not found",
            )

    return {
        "message": "Status updated successfully"
    }

@app.get("/members/{branch}/{cell_group}")
def get_members(branch: str, cell_group: str):

    with engine.connect() as connection:

        # Get branch id from branch name
        branch_row = connection.execute(
            text("""
                SELECT id
                FROM branches
                WHERE branch_name = :branch
            """),
            {
                "branch": branch
            }
        ).fetchone()

        if branch_row is None:
            raise HTTPException(
                status_code=404,
                detail="Branch not found"
            )

        result = connection.execute(
            text("""
                SELECT
                    id,
                    full_name,
                    phone
                FROM members
                WHERE branch_id = :branch_id
                AND cell_group = :cell_group
                ORDER BY full_name
            """),
            {
                "branch_id": branch_row.id,
                "cell_group": cell_group,
            },
        )

        return [
            {
                "id": row.id,
                "full_name": row.full_name,
                "phone": row.phone,
            }
            for row in result
        ]
# ======================================
# CREATE HOUSE VISIT ROUND
# ======================================

@app.post("/house-visit-queue/start-round")
def start_house_visit_round(round_data: HouseVisitRound):

    with engine.begin() as connection:

        # Archive old queue
        connection.execute(
            text("""
                DELETE FROM house_visit_queue
                WHERE branch=:branch
                AND cell_group=:cell_group
            """),
            {
                "branch": round_data.branch,
                "cell_group": round_data.cell_group,
            },
        )

        # Insert new queue
        for member in round_data.members:

            connection.execute(
                text("""
                    INSERT INTO house_visit_queue
                    (
                        branch,
                        cell_group,
                        round_no,
                        member_id,
                        visit_order,
                        status
                    )
                    VALUES
                    (
                        :branch,
                        :cell_group,
                        :round_no,
                        :member_id,
                        :visit_order,
                        'Pending'
                    )
                """),
                {
                    "branch": round_data.branch,
                    "cell_group": round_data.cell_group,
                    "round_no": round_data.round_no,
                    "member_id": member.member_id,
                    "visit_order": member.visit_order,
                },
            )

    return {
        "message": "House visit round created successfully"
    }

# ======================================
# GET CURRENT HOUSE VISIT QUEUE
# ======================================

@app.get("/house-visit-queue/{branch}/{cell_group}")
def get_house_visit_queue(branch: str, cell_group: str):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                SELECT
                    h.id,
                    h.visit_order,
                    h.status,
                    h.round_no,
                    m.id AS member_id,
                    m.full_name,
                    m.phone
                FROM house_visit_queue h
                JOIN members m
                    ON h.member_id = m.id
                WHERE h.branch = :branch
                  AND h.cell_group = :cell_group
                ORDER BY h.visit_order
            """),
            {
                "branch": branch,
                "cell_group": cell_group,
            },
        )

        return [
            {
                "id": row.id,
                "member_id": row.member_id,
                "full_name": row.full_name,
                "phone": row.phone,
                "visit_order": row.visit_order,
                "status": row.status,
                "round_no": row.round_no,
            }
            for row in result
        ]
   # ======================================
# SEND CHAT MESSAGE
# ======================================

@app.post("/chat-messages")
def send_chat_message(chat: ChatMessage):

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO chat_messages
                (
                    sender_name,
                    sender_type,
                    department,
                    message,
                    branch,
                 reply_to_id
                )
                VALUES
                (
                    :sender_name,
                    :sender_type,
                    :department,
                    :message,
                    :branch,
                 :reply_to_id
                )
            """),
            {
                "sender_name": chat.sender_name,
                "sender_type": chat.sender_type,
                "department": chat.department,
                "message": chat.message,
                "branch": chat.branch,
                "reply_to_id": chat.reply_to_id,
            },
        )

    return {
        "message": "Chat message sent successfully"
    }
 # ======================================
# GET CHAT MESSAGES
# ======================================

@app.get("/chat-messages/{branch}")
def get_chat_messages(branch: str, department: Optional[str] = None):

    with engine.connect() as connection:

        if department:
            result = connection.execute(
                text("""
                SELECT
                    id,
                    sender_name,
                    sender_type,
                    department,
                    message,
                    branch,
                 reply_to_id,
                    created_at
                FROM chat_messages
                WHERE branch = :branch
                AND department = :department
                ORDER BY created_at ASC
                """),
                {
                    "branch": branch,
                    "department": department,
                },
            )
        else:
            result = connection.execute(
                text("""
                SELECT
                    id,
                    sender_name,
                    sender_type,
                    department,
                    message,
                    branch,
                 reply_to_id,
                    created_at
                FROM chat_messages
                WHERE branch = :branch
                ORDER BY created_at ASC
                """),
                {"branch": branch},
            )

        return [
            {
                "id": row.id,
                "sender_name": row.sender_name,
                "sender_type": row.sender_type,
                "department": row.department,
                "message": row.message,
                "branch": row.branch,
                "reply_to_id": row.reply_to_id,
                "created_at": str(row.created_at),
            }
            for row in result
        ]


@app.delete("/chat-messages/{message_id}")
def delete_chat_message(message_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            text("""
                DELETE FROM chat_messages
                WHERE id=:id
            """),
            {"id": message_id},
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Message not found",
            )

    return {"message": "Message deleted successfully"}
# =========================
# DEPARTMENTS
# =========================

@app.get("/departments")
def get_departments():


    with engine.connect() as connection:


        result = connection.execute(

            text("""
            SELECT
            id,
            department_name,
            description,
            branch_id

            FROM departments

            ORDER BY id
            """)

        )


        return [

        {
        "id":row.id,
        "department_name":row.department_name,
        "description":row.description,
        "branch_id":row.branch_id
        }

        for row in result

        ]







# =========================
# BRANCH GALLERY
# =========================

@app.get("/home-gallery")
def get_home_gallery():
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT id, image_name, image_path
                FROM home_gallery
                ORDER BY id DESC
            """)
        )

        return [
            {
                "id": row.id,
                "image_name": row.image_name,
                "image_path": row.image_path,
            }
            for row in result
        ]


@app.post("/upload-home-images")
async def upload_home_images(files: List[UploadFile] = File(...)):
    for file in files:
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with engine.begin() as connection:
            connection.execute(
                text("""
                    INSERT INTO home_gallery (image_name, image_path)
                    VALUES (:image_name, :image_path)
                """),
                {"image_name": file.filename, "image_path": filename},
            )

    return {"message": "Home gallery images uploaded successfully"}


@app.delete("/home-gallery/{image_id}")
def delete_home_image(image_id: int):
    with engine.begin() as connection:
        image = connection.execute(
            text("SELECT image_path FROM home_gallery WHERE id = :id"),
            {"id": image_id},
        ).fetchone()

        if not image:
            return {"message": "Image not found"}

        file_path = os.path.join(UPLOAD_FOLDER, image.image_path)
        if os.path.exists(file_path):
            os.remove(file_path)

        connection.execute(
            text("DELETE FROM home_gallery WHERE id = :id"),
            {"id": image_id},
        )

    return {"message": "Image deleted successfully"}

@app.get("/branch-gallery/{branch}")
def get_branch_gallery(branch:str):


    with engine.connect() as connection:


        result = connection.execute(


            text("""
            SELECT

            id,
            image_name,
            image_path

            FROM branch_gallery

            WHERE branch=:branch

            ORDER BY id DESC

            """),

            {
            "branch":branch
            }

        )


        return [

        {
        "id":row.id,
        "image_name":row.image_name,
        "image_path":row.image_path
        }

        for row in result

        ]







# =========================
# MULTIPLE IMAGE UPLOAD
# =========================

@app.post("/upload-branch-images")
async def upload_branch_images(

    branch:str = Form(...),

    files:List[UploadFile] = File(...)

):


    for file in files:


        filename = (

            str(uuid.uuid4())

            +

            "_"

            +

            file.filename

        )


        file_path = os.path.join(

            UPLOAD_FOLDER,

            filename

        )



        with open(file_path,"wb") as buffer:


            shutil.copyfileobj(

                file.file,

                buffer

            )




        with engine.begin() as connection:


            connection.execute(


                text("""

                INSERT INTO branch_gallery

                (

                branch,

                image_name,

                image_path

                )

                VALUES

                (

                :branch,

                :image_name,

                :image_path

                )

                """),



                {

                "branch":branch,

                "image_name":file.filename,

                "image_path":filename

                }

            )



    return {

        "message":"Images uploaded successfully"

    }






# =========================
# DELETE IMAGE
# =========================


@app.delete("/branch-gallery/{image_id}")
def delete_branch_image(image_id:int):


    with engine.begin() as connection:


        image = connection.execute(

            text("""

            SELECT image_path

            FROM branch_gallery

            WHERE id=:id

            """),

            {
            "id":image_id
            }

        ).fetchone()



        if image:


            file_path = os.path.join(

                UPLOAD_FOLDER,

                image.image_path

            )


            if os.path.exists(file_path):

                os.remove(file_path)



            connection.execute(

                text("""

                DELETE FROM branch_gallery

                WHERE id=:id

                """),

                {
                "id":image_id
                }

            )



    return {

        "message":"Image deleted"

    }
