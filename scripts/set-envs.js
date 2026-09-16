const { writeFileSync, mkdirSync } = require('fs')

require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';


const API_KEY_MAPS = process.env['API_KEY_MAPS']
if (!API_KEY_MAPS) {
  throw new Error("API_KEY_MAPS was not set")
}

const envFileContent = `
export const environment = {
  API_KEY_MAPS: "${API_KEY_MAPS}"
};
`

mkdirSync('./src/environments', { recursive: true })
writeFileSync(targetPath, envFileContent)
writeFileSync(targetPathDev, envFileContent)
