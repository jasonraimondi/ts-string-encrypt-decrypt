import { AbstractStringEncrypter } from "./index.ts";

export class BrowserStringEncrypter extends AbstractStringEncrypter {
  public readonly crypto = window.crypto;
  public readonly subtle = window.crypto.subtle!;

  static generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
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
    const cryptoKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(jwkString),
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"],
    );
    return new BrowserStringEncrypter(cryptoKey);
  }
}
