# @jmondi/string-encrypt-decrypt

This repository provides a simple and secure way to encrypt and decrypt strings
using the Web Crypto API. It includes classes for both browser and server (Deno)
environments.

## Features

- Encrypt and decrypt strings using AES-GCM algorithm
- Generate and export encryption keys
- Supports both browser and server (Deno) environments

## Installation

### Browser

```html
<script type="module">
  import { BrowserStringEncrypter } from 'https://deno.land/x/string_encrypt_decrypt/mod.ts';

  // Your code here
</script>
```

### Deno

```typescript
import { StringEncrypter } from "https://deno.land/x/string_encrypt_decrypt/mod.ts";
```

### Node.js

```bash
npm install @jmondi/string-encrypt-decrypt
```

Then, in your JavaScript or TypeScript file:

```javascript
import { StringEncrypter } from "@jmondi/string-encrypt-decrypt";
```

## Usage

```typescript
// Generate a new encryption key
const cryptoKey = await StringEncrypter.generateKey();

// Create a new StringEncrypter instance
const encrypter = new StringEncrypter(cryptoKey);

// Encrypt a string
const clearText = "Hello, World!";
const encryptedText = await encrypter.encrypt(clearText);

// Decrypt the encrypted string
const decryptedText = await encrypter.decrypt(encryptedText);

console.log(decryptedText); // Output: Hello, World!
```

For more detailed usage and examples, please refer to the
[documentation](https://deno.land/x/string_encrypt_decrypt).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an
issue if you find a bug or have a feature request.
