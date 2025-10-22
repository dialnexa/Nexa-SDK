from dialnexa import create_client


def main():
    client = create_client()
    llm_id = "llm_mgtbfhomt5523g"

  # list llms
    client.llms.list()
    
  # Fetch specific llm by ID
    client.llms.get(llm_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
