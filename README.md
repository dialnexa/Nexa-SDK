# Nexa SDK

SDKs for interacting with the Nexa Languages API in JavaScript, Python, and Java.

Endpoints covered:
- GET `/languages` (optional `voice_model_id`)
- GET `/languages/{id}`

OpenAPI spec is at `openapi/swagger.json`.

---

## JavaScript SDK

### Install & Build

```bash
cd js
npm install
npm run build
```

### Usage

```ts
import { listLanguages, getLanguageById } from "./dist/languages.js";

const apiKey = process.env.NEXA_API_KEY || "YOUR_API_KEY";

// List languages (voice_model_id optional)
const list = await listLanguages({ apiKey });
// or filtered by model
// const list = await listLanguages({ apiKey, voiceModelId: "voice_model_123" });
console.log(list.languages);

// Get one language by ID
const lang = await getLanguageById({ apiKey, id: "language_456" });
console.log(lang);
```

---

## Python SDK

### Install (editable dev)

```bash
cd python
pip install -e .
```

### Usage

```python
from sdk import LanguagesClient

client = LanguagesClient(api_key="YOUR_API_KEY")

# List languages (voice_model_id optional)
resp = client.list_languages()
# or filtered by model
# resp = client.list_languages(voice_model_id="voice_model_123")
for lang in resp.languages:
    print(lang.code, lang.name, lang.native_name)

# Get one language by ID
lang = client.get_language_by_id(language_id="language_456")
print(lang)
```

---

## Java SDK

This module provides a Java library client (no runnable app configured).

### Build

```bash
cd java
./gradlew build    # or: gradle build
```

### Usage (snippet)

```java
import com.nexa.sdk.LanguagesClient;
import com.nexa.sdk.LanguagesResponse;
import com.nexa.sdk.Language;

LanguagesClient client = new LanguagesClient(System.getenv("NEXA_API_KEY"));

LanguagesResponse list = client.listLanguages(null); // or pass a model id
for (Language l : list.getLanguages()) {
    System.out.println(l.getCode() + ": " + l.getName());
}

Language lang = client.getLanguageById("language_456");
System.out.println(lang.getName());
```

---

## Error Handling

- 400 Bad Request: invalid parameters
- 401 Unauthorized: missing/invalid API key
- 404 Not Found: unknown resource
- 500 Internal Server Error

Each SDK raises an error with HTTP status and body for debugging.

---

## Notes

- JavaScript builds TypeScript from `src` to `dist` via `tsc`.
- Python package installs a module named `sdk` (consider renaming to `nexa_sdk` in a future major).
- Java library targets JDK 11+ and uses Jackson for JSON.

---

## Contributing

1. Fork and clone the repo
2. Make changes in `js/`, `python/`, or `java/`
3. For JS: `npm run build` in `js/`
4. For Python: `pip install -e .` in `python/`
5. For Java: `gradle build` in `java/`
6. Open a PR
