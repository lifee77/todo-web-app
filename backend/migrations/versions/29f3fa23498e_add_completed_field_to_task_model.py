"""Add completed field to Task model

Revision ID: 29f3fa23498e
Revises: 6838e8c4c07d
Create Date: 2024-11-02 16:28:42.228672

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '29f3fa23498e'
down_revision: Union[str, None] = '6838e8c4c07d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
