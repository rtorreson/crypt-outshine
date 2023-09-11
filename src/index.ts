import { Crypt, Decrypt } from './lib';

export function encrypt(filepath: string, secret: string): void {
  if (!filepath || !secret) {
    console.error('No content');
  }

  const cryptor = new Crypt(secret);
  return cryptor.encryptDirectory(filepath);
}

export function decrypt(filepath: string, secret: string): void {
  if (!filepath || !secret) {
    console.error('No content');
  }

  const cryptor = new Decrypt(secret);
  return cryptor.executeDirectory(filepath);
}
