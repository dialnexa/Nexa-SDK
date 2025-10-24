from dialnexa import NexaClient


def main():
    client = NexaClient()
    lang_id = "lang_mgtbeiyplhqcc8"

    # list languages
    client.languages.list()

    # Fetch specific language by ID
    client.languages.get(lang_id)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
