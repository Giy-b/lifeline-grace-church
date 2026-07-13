from pydantic import BaseModel
from typing import Optional


class Announcement(BaseModel):
    id: Optional[int] = None
    title: str
    message: str
    branch: str