import { BrowserStringEncrypter } from "./browser.ts";
import { AbstractStringEncrypter } from "./index.ts";

export class StringEncrypter extends AbstractStringEncrypter {
  public readonly crypto = crypto;
  public readonly subtle = crypto.subtle!;

  static generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    );
  }

  static async fromCryptoString(
    jwkString: string,
  ): Promise<BrowserStringEncrypter> {
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(jwkString),
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"],
    );
    return new BrowserStringEncrypter(cryptoKey);
  }
}
