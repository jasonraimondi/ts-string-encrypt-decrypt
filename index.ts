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

  constructor(public readonly cryptoKey: CryptoKey) {}

  abstract encrypt(clearText: string): Promise<EncryptedStringData>;
  abstract decrypt(encryptedData: EncryptedStringData): Promise<string>;

  protected isEncryptedStringData(data: string): data is EncryptedStringData {
    if (!data.startsWith("str-enc:")) return false;
    return data.split(":").length === 3;
  }
}

export class BrowserStringEncrypter extends AbstractStringEncrypter {
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

  async encrypt(clearText: string): Promise<EncryptedStringData> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      this.textEncoder.encode(clearText),
    );
    const decodedCipherText = StringEncrypter.base64Encode(
      new Uint8Array(ciphertext),
    );
    const decodedIV = StringEncrypter.base64Encode(iv);
    return `str-enc:${decodedCipherText}:${decodedIV}`;
  }

  async decrypt(encryptedData: EncryptedStringData): Promise<string> {
    if (!this.isEncryptedStringData(encryptedData)) {
      throw new Error("Invalid encrypted data");
    }
    const [_, decodedCipherText, decodedIV] = encryptedData.split(":");
    const cipherText = StringEncrypter.base64Decode(decodedCipherText);
    const iv = StringEncrypter.base64Decode(decodedIV);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      cipherText,
    );
    return this.textDecoder.decode(decrypted);
  }
}

export class StringEncrypter extends AbstractStringEncrypter {
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    );
  }

  async encrypt(clearText: string): Promise<EncryptedStringData> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      this.textEncoder.encode(clearText),
    );
    const decodedCipherText = StringEncrypter.base64Encode(
      new Uint8Array(ciphertext),
    );
    const decodedIV = StringEncrypter.base64Encode(iv);
    return `str-enc:${decodedCipherText}:${decodedIV}`;
  }

  async decrypt(encryptedData: EncryptedStringData): Promise<string> {
    if (!this.isEncryptedStringData(encryptedData)) {
      throw new Error("Invalid encrypted data");
    }
    const [_, decodedCipherText, decodedIV] = encryptedData.split(":");
    const cipherText = StringEncrypter.base64Decode(decodedCipherText);
    const iv = StringEncrypter.base64Decode(decodedIV);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      this.cryptoKey,
      cipherText,
    );
    return this.textDecoder.decode(decrypted);
  }
}
