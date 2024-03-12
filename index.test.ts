import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {StringEncrypter} from "./index.ts";

Deno.test("StringEncrypter class", async (t) => {
  const secret = "my-secret-key";
  const crypto = new StringEncrypter(secret);

  await t.step("should encrypt and decrypt text correctly", async () => {
    const clearText = "Hello, World!";
    const encryptedText = await crypto.encrypt(clearText);
    const decryptedText = await crypto.decrypt(encryptedText);
    assertEquals(decryptedText, clearText);
  });

  // await t.step("should throw an error when decrypting with the wrong secret", async () => {
  //   const clearText = "Hello, World!";
  //   const encryptedText = await crypto.encrypt(clearText);
  //   const wrongPasswordEncrypter = new StringEncrypter("wrong-secret");
  //   await assertEquals(
  //     wrongPasswordEncrypter.decrypt(encryptedText),
  //     Promise.reject(TypeError)
  //   );
  // });
});
