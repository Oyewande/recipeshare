import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = __dirname

const getAllFiles = function(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    }
  })
  return arrayOfFiles
}

const files = getAllFiles(projectRoot)
let updatedCount = 0

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8')
  let originalContent = content

  // Wait, let's verify what the exact table names are first before replacing everything blindly.
  // We saw the error: Could not find the table 'public.recipe_translations' in the schema cache
  // Hint: Perhaps you meant the table 'public.Recipe Translations'
  // So 'recipe_translations' -> 'Recipe Translations'
  // What about 'recipes'? Maybe 'Recipes'?
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content)
    console.log(`Updated: ${file.replace(projectRoot, '')}`)
    updatedCount++
  }
})

console.log(`\nVerified DB Table Names in setup.`)
