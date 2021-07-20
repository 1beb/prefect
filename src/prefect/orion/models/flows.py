from typing import List
import sqlalchemy as sa
from sqlalchemy import select, delete

from prefect.orion.models import orm
from prefect.orion.api import schemas


async def create_flow(session: sa.orm.Session, flow: schemas.Flow) -> orm.Flow:
    """Creates a new flow

    Args:
        session (sa.orm.Session): a database session
        flow (schemas.Flow): a flow model

    Returns:
        orm.Flow: the newly-created flow

    Raises:
        sqlalchemy.exc.IntegrityError: if a flow with the same name already exists

    """
    flow = orm.Flow(**flow.dict())
    session.add(flow)
    await session.flush()
    return flow


async def read_flow(session: sa.orm.Session, id: str) -> orm.Flow:
    """Reads a flow by id

    Args:
        session (sa.orm.Session): A database session
        id (str): a flow id

    Returns:
        orm.Flow: the flow
    """
    return await session.get(orm.Flow, id)


async def read_flow_by_name(session: sa.orm.Session, name: str) -> orm.Flow:
    """Reads a flow by name

    Args:
        session (sa.orm.Session): A database session
        name (str): a flow name

    Returns:
        orm.Flow: the flow
    """
    stmt = await session.execute(select(orm.Flow).filter_by(name=name))
    return stmt.scalar()


async def read_flows(
    session: sa.orm.Session,
    offset: int = None,
    limit: int = None,
) -> List[orm.Flow]:

    query = select(orm.Flow).order_by(orm.Flow.name)

    if offset is not None:
        query = query.offset(offset)
    if limit is not None:
        query = query.limit(limit)

    result = await session.execute(query)
    return result.scalars().all()


async def delete_flow(session: sa.orm.Session, id: str) -> bool:
    result = await session.execute(delete(orm.Flow).where(orm.Flow.id == id))
    return result.rowcount > 0
