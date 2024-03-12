import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { StringEncrypter } from "./index.ts";
import { assertThrows } from "https://deno.land/std@0.219.1/assert/assert_throws.ts";

Deno.test("StringEncrypter class", async (t) => {
  const cryptoKey = await StringEncrypter.generateKey();
  const crypto = new StringEncrypter(cryptoKey);

  await t.step("should encrypt and decrypt text correctly", async () => {
    const clearText = "Hello, World!";
    const encryptedText = await crypto.encrypt(clearText);
    const decryptedText = await crypto.decrypt(encryptedText);

    assertEquals(decryptedText, clearText);
  });

  await t.step(
    "should encrypt and decrypt with different StringEncrypter instances using same cryptoKey",
    async () => {
      const otherCrypto = new StringEncrypter(cryptoKey);

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
});
