import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), './db/');

export async function writeJSON(filename, data) {
  return mkdir(DB_PATH, { recursive: true })
    .then(() =>
      writeFile(
        `${DB_PATH}/${filename}.json`,
        JSON.stringify(data, null, 2),
        'utf-8'
      )
    )
    .catch((err) =>
      console.log(`An error occured trying to write file: ${err}`)
    );
}
