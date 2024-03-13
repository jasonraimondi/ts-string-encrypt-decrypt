import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { BrowserStringEncrypter } from "./index.ts";

Deno.test("BrowserStringEncrypter class", async (t) => {
  const cryptoKey = await BrowserStringEncrypter.generateKey();
  const crypto = new BrowserStringEncrypter(cryptoKey);

  await t.step("should encrypt and decrypt text correctly", async () => {
    const clearText = "Hello, World!";
    const encryptedText = await crypto.encrypt(clearText);
    const decryptedText = await crypto.decrypt(encryptedText);

    assertEquals(decryptedText, clearText);
  });

  await t.step(
    "should encrypt and decrypt with different BrowserStringEncrypter instances using same cryptoKey",
    async () => {
      const otherCrypto = new BrowserStringEncrypter(cryptoKey);

      const clearText = "Hello, World!";
      const encryptedText = await crypto.encrypt(clearText);
      const decryptedText = await otherCrypto.decrypt(encryptedText);

      assertEquals(decryptedText, clearText);
    },
  );

  await t.step("should encrypt and decrypt an empty string", async () => {
    const clearText = "";
    const encryptedText = await crypto.encrypt(clearText);
    const decryptedText = await crypto.decrypt(encryptedText);
    assertEquals(decryptedText, clearText);
  });

  await t.step("can import from crytoString", async () => {
    const jwk = await crypto.exportKeyString();
    const encrypter = await BrowserStringEncrypter.fromCryptoString(jwk);
    const clearText = "Hello, World!";

    const encryptedText = await encrypter.encrypt(clearText);
    const decryptedText = await crypto.decrypt(encryptedText);
    assertEquals(decryptedText, clearText);
  });
});
