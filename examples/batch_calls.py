import sys
from dialnexa import NexaClient
import os

# Pagination/Sorting defaults
DEFAULT_PAGE = 1
DEFAULT_LIMIT = 10
DEFAULT_SORT_BY = "created_at"
DEFAULT_SORT_ORDER = "DESC"


def main(file_path: str):
    if not file_path:
        print("Usage: python examples/batch_calls.py <file_path>")
        return 1

    client = NexaClient(api_key="your_api_key_here")

    agent_id = "agent_mh0k898wyp12l5"
    agent_version_number = 0
    title = "My batch demo"

    # Open the Excel/CSV file
    with open(file_path, "rb") as file_stream:
        print("Creating batch call ...")
        # HttpClient will print structured JSON automatically
        created = client.batch_calls.create(
            file=file_stream,
            filename=os.path.basename(file_path),
            title=title,
            agent_id=agent_id,
            agent_version_number=agent_version_number,
        )

    print("\nListing batch calls ...")
    client.batch_calls.list(
        page=DEFAULT_PAGE,
        limit=DEFAULT_LIMIT,
        sort_by=DEFAULT_SORT_BY,
        sort_order=DEFAULT_SORT_ORDER,
    )

    batch_id = (
        (created or {}).get("id")
    )
    if batch_id:
        print(f"\nListing calls in batch {batch_id} ...")
        client.batch_calls.get(batch_id, page=DEFAULT_PAGE, limit=DEFAULT_LIMIT)
    else:
        print("Could not determine batch id from creation response.")

    return 0


if __name__ == "__main__":
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    raise SystemExit(main(file_path))
