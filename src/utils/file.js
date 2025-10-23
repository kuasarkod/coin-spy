import { promises as fs } from 'fs';
import path from 'path';

export const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
};

export const writeFile = async (filePath, content) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
};
