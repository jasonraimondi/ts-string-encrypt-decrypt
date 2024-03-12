export class StringEncrypter {
  constructor(private readonly secret: string, private cryptoKey?: CryptoKey) {}

  async getCryptoKey(): Promise<CryptoKey> {
    if (!this.cryptoKey) {
      this.cryptoKey = await window.crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256
      }, false, ["encrypt", "decrypt"]);
    }
    return this.cryptoKey;
  }

  async encrypt(clearText: string): Promise<string> {
    const key = await this.getCryptoKey();
    console.log(key);
    return clearText;
  }

  async decrypt(encryptedText: string): Promise<string> {
    const key = await this.getCryptoKey();
    console.log(key);
    return encryptedText;
  }
}
