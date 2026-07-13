from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GroupMessage(BaseModel):
    id: Optional[int] = None
    sender_name: str
    sender_role: str          # Member, Secretary, Bishop, Pastor...
    sender_department: str    # Administration, Youth, Media...
    branch: str
    message: str
    message_type: str = "message"   # message or announcement
    created_at: Optional[datetime] = None