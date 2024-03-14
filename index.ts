export type EncryptedStringData = `str-enc:${string}:${string}`;

abstract class AbstractStringEncrypter {
  protected readonly textDecoder = new TextDecoder();
  protected readonly textEncoder = new TextEncoder();

  protected static base64Encode(data: Uint8Array): string {
    return btoa(String.fromCharCode(...data));
  }

  protected static base64Decode(data: string): Uint8Array {
    return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  }

  constructor(public readonly cryptoKey: CryptoKey) {
  }

  abstract readonly crypto: Crypto;
  abstract readonly subtle: SubtleCrypto;

  protected isEncryptedStringData(data: string): data is EncryptedStringData {
    if (!data.startsWith("str-enc:")) return false;
    return data.split(":").length === 3;
  }

  async exportKey() {
    return await this.subtle.exportKey(
      "jwk",
      this.cryptoKey,
    );
  }

  async exportKeyString() {
    return JSON.stringify(await this.exportKey());
  }

  async encrypt(clearText: string): Promise<EncryptedStringData> {
    const iv = this.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await this.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      this.textEncoder.encode(clearText),
    );
    const decodedCipherText = AbstractStringEncrypter.base64Encode(
      new Uint8Array(ciphertext),
    );
    const decodedIV = AbstractStringEncrypter.base64Encode(iv);
    return `str-enc:${decodedCipherText}:${decodedIV}`;
  }

  async decrypt(encryptedData: EncryptedStringData): Promise<string> {
    if (!this.isEncryptedStringData(encryptedData)) {
      throw new Error("Invalid encrypted data");
    }
    const [_, decodedCipherText, decodedIV] = encryptedData.split(":");
    const cipherText = AbstractStringEncrypter.base64Decode(decodedCipherText);
    const iv = AbstractStringEncrypter.base64Decode(decodedIV);
    const decrypted = await this.subtle.decrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      cipherText,
    );
    return this.textDecoder.decode(decrypted);
  }
}

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
