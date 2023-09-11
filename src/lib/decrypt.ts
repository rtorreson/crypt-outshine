import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createDecipheriv } from 'node:crypto';
import { argv, exit } from 'node:process';
import { Buffer } from 'node:buffer';
import { join } from 'node:path';

export class Decrypt {
  private decryptionKey: string;
  private iv: Buffer;

  constructor(decryptionKey: string) {
    this.decryptionKey = decryptionKey;
    this.iv = Buffer.alloc(16);
  }

  private decryptCode(encryptedCode: string): string {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.decryptionKey),
      this.iv
    );
    let decryptedCode = decipher.update(encryptedCode, 'hex', 'utf8');
    decryptedCode += decipher.final('utf8');
    return decryptedCode;
  }

  public executeDecryptedCode(filePath: string): void {
    try {
      const encryptedCode = readFileSync(filePath, 'utf8');
      const decryptedCode = this.decryptCode(encryptedCode);
      eval(decryptedCode); // todo: considerar alternativas seguras.

      console.log(`Executed code from: ${filePath}`);
    } catch (error) {
      console.error(`Error executing code from: ${filePath}`);
      console.error(error);
    }
  }

  public executeDirectory(directoryPath: string) {
    readdirSync(directoryPath).forEach((item) => {
      const itemPath = join(directoryPath, item);
      if (statSync(itemPath).isDirectory()) {
        this.executeDirectory(itemPath);
      } else {
        this.executeDecryptedCode(itemPath);
      }
    });
  }
}

// const filePath = argv[2];
// const iv = Buffer.alloc(16);

// if (!filePath) {
//   console.error('Especifique o caminho do arquivo para executar.');
//   exit(1);
// }

// const decryptor = new Decrypt(process.env.secret!);
// decryptor.executeDecryptedCode(filePath);
