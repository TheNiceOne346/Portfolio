import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.join(__dirname, 'resume.html')
const pdfPath = path.join(__dirname, '..', 'public', 'resume.pdf')

async function ensurePuppeteer() {
  const dir = path.join(__dirname, '.resume-tools')
  const pkgPath = path.join(dir, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(pkgPath, JSON.stringify({ type: 'module', private: true }, null, 2))
    await run('npm', ['install', 'puppeteer'], dir)
  }
  return path.join(dir, 'node_modules', 'puppeteer')
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: true })
    child.on('exit', (code) => {
      if (code === 0) resolve(undefined)
      else reject(new Error(`${command} exited with code ${code}`))
    })
  })
}

const puppeteerPath = path.join(await ensurePuppeteer(), 'lib', 'puppeteer', 'puppeteer.js')
const { default: puppeteer } = await import(pathToFileURL(puppeteerPath).href)

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})
await browser.close()

console.log('Wrote', pdfPath)
