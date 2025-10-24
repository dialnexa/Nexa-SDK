from dialnexa import NexaClient


def main():
    client = NexaClient()
    llm_id = "llm_mgtbfhomt5523g"

  # list llms
    client.llms.list()
    
  # Fetch specific llm by ID
    client.llms.get(llm_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
