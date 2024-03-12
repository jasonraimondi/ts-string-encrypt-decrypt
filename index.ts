export class StringEncrypter {
  constructor(private readonly secret: string, private cryptoKey?: CryptoKey) {
  }

  async encrypt(clearText: string): Promise<ArrayBuffer> {
    const key = await this.getCryptoKey();
    return await window.crypto.subtle.encrypt(
      this.algo,
      key,
      new TextEncoder().encode(clearText),
    );
  }

  async decrypt(encryptedText: ArrayBuffer): Promise<string> {
    const key = await this.getCryptoKey();
    const decrypted = await window.crypto.subtle.decrypt(
      this.algo,
      key,
      encryptedText,
    );
    return new TextDecoder().decode(decrypted);
  }

  private async getCryptoKey(): Promise<CryptoKey> {
    if (!this.cryptoKey) {
      this.cryptoKey = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        false,
        ["encrypt", "decrypt"],
      );
    }
    return this.cryptoKey;
  }

  private get algo() {
    return { name: "AES-GCM", iv: new Uint8Array(12) };
  }
}
