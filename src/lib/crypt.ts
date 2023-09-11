import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  statSync,
  readFileSync,
} from 'node:fs';
import { scryptSync, createCipheriv } from 'node:crypto';
import { join } from 'node:path';
import chokidar from 'chokidar';

export class Crypt {
  private encryptionKey: string;

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  private encryptCode(sourceCode: string): string {
    const key = scryptSync(this.encryptionKey, 'salt', 32);
    const iv = Buffer.alloc(16, 0);

    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encryptedCode = cipher.update(sourceCode, 'utf8', 'hex');
    encryptedCode += cipher.final('hex');
    return encryptedCode;
  }

  private createBuildDirectory(): void {
    if (!existsSync('build')) {
      mkdirSync('build');
    }
  }

  private encryptAndSaveFile(filePath: string): void {
    const sourceCode = readFileSync(filePath, 'utf8');
    const encryptedCode = this.encryptCode(sourceCode);
    const outputPath = `build/${filePath}`;
    writeFileSync(outputPath, encryptedCode, 'utf8');
  }

  public watchAndEncrypt(srcDirectory: string): void {
    this.createBuildDirectory();

    chokidar.watch(srcDirectory).on('add', (filePath) => {
      this.encryptAndSaveFile(filePath);
      console.log(`Encrypted and saved: ${filePath}`);
    });
  }

  public encryptDirectory(directoryPath: string) {
    readdirSync(directoryPath).forEach((item) => {
      const itemPath = join(directoryPath, item);
      if (statSync(itemPath).isDirectory()) {
        this.encryptDirectory(itemPath);
      } else {
        this.encryptAndSaveFile(itemPath);
      }
    });
  }
}
