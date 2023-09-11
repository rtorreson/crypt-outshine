declare module 'crypt-outshine' {
  export class Crypt {
    constructor(encryptionKey: string);
    watchAndEncrypt(srcDirectory: string): void;
    encryptDirectory(directoryPath: string): void;
  }

  export class Decrypt {
    constructor(decryptionKey: string);
    executeDecryptedCode(filePath: string): void;
    executeDirectory(directoryPath: string): void;
  }

  export function encrypt(filepath: string, secret: string): void;
  export function decrypt(filepath: string, secret: string): void;
}
