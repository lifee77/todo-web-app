from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9b80d31642c1'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add 'parent_id' column to 'task' table
    op.add_column('task', sa.Column('parent_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_task_parent_id', 'task', 'task', ['parent_id'], ['id'])

    # Add 'user_id' column to 'task_list' table
    op.add_column('task_list', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_tasklist_user_id', 'task_list', 'user', ['user_id'], ['id'])

    # Backfill 'user_id' in 'task_list' table
    connection = op.get_bind()

    # Check if there's at least one user
    user_result = connection.execute("SELECT id FROM user LIMIT 1")
    user_row = user_result.fetchone()
    if user_row:
        default_user_id = user_row[0]
    else:
        # Create a default user
        connection.execute(
            "INSERT INTO user (username, password_hash) VALUES ('default_user', 'default_password_hash')"
        )
        default_user_id = connection.execute(
            "SELECT id FROM user WHERE username='default_user'"
        ).fetchone()[0]

    # Assign all existing task lists to the default user
    connection.execute(f"UPDATE task_list SET user_id={default_user_id} WHERE user_id IS NULL")

    # Alter 'user_id' to be non-nullable
    op.alter_column('task_list', 'user_id', existing_type=sa.Integer(), nullable=False)

    # Ensure 'password_hash' is non-nullable
    op.alter_column('user', 'password_hash', existing_type=sa.String(128), nullable=False)

    # Backfill 'password_hash' for existing users
    connection.execute("UPDATE user SET password_hash='default_password_hash' WHERE password_hash IS NULL")

def downgrade():
    # Drop 'user_id' from 'task_list'
    op.drop_constraint('fk_tasklist_user_id', 'task_list', type_='foreignkey')
    op.drop_column('task_list', 'user_id')

    # Drop 'parent_id' from 'task'
    op.drop_constraint('fk_task_parent_id', 'task', type_='foreignkey')
    op.drop_column('task', 'parent_id')
