import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toolsDir = path.join(__dirname, '.resume-tools')
if (!fs.existsSync(path.join(toolsDir, 'node_modules', 'pdf-parse'))) {
  console.error('Run generate-resume.mjs first to install tools')
  process.exit(1)
}

const { PDFParse } = await import(pathToFileURL(path.join(toolsDir, 'node_modules', 'pdf-parse', 'dist', 'pdf-parse', 'esm', 'index.js')).href)
const pdfPath = 'c:/Users/simon/Downloads/RESUME - SIMON OLSSON (4).pdf'
const parser = new PDFParse({ data: fs.readFileSync(pdfPath) })
const outDir = path.join(__dirname, 'reference')
fs.mkdirSync(outDir, { recursive: true })
const shot = await parser.getScreenshot({ scale: 2, desiredWidth: 900 })
for (const [index, page] of shot.pages.entries()) {
  if (page?.data) {
    fs.writeFileSync(path.join(__dirname, 'reference', `original-page-${index + 1}.png`), Buffer.from(page.data))
    console.log('wrote page', index + 1)
  }
}
await parser.destroy()
