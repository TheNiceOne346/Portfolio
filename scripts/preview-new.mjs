import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { PDFParse } = await import(pathToFileURL(path.join(__dirname, '.resume-tools', 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'esm', 'index.js')).href)
const parser = new PDFParse({ data: fs.readFileSync(path.join(__dirname, '..', 'public', 'resume.pdf')) })
const shot = await parser.getScreenshot({ scale: 2, desiredWidth: 900 })
fs.writeFileSync(path.join(__dirname, 'reference', 'new-page-1.png'), Buffer.from(shot.pages[0].data))
console.log('preview saved')
await parser.destroy()
