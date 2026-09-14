const fs = require('fs');

let fileContent = fs.readFileSync('src/lib/translations.ts', 'utf8');
const translations = JSON.parse(fs.readFileSync('generated_translations.txt', 'utf8'));

let toAddFR = [];
let toAddEN = [];

for (const [key, value] of Object.entries(translations)) {
  toAddFR.push(`    ${key}: '${value.replace(/'/g, "\\'")}',`);
  toAddEN.push(`    ${key}: '${value.replace(/'/g, "\\'")} (EN)',`);
}

const partsFR = fileContent.split('    // Occasions');
if(partsFR.length === 3) {
  fileContent = partsFR[0] + '    // Occasions\n' + toAddFR.join('\n') + partsFR[1] + '    // Occasions\n' + toAddEN.join('\n') + partsFR[2];
}

fs.writeFileSync('src/lib/translations.ts', fileContent);

