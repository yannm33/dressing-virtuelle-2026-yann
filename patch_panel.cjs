const fs = require('fs');

let fileContent = fs.readFileSync('src/components/OccasionStylingPanel.tsx', 'utf8');
const catMap = fs.readFileSync('generated_category_map.txt', 'utf8');
const styleCats = fs.readFileSync('generated_style_category.txt', 'utf8');

// Replace StyleCategory
fileContent = fileContent.replace(/type StyleCategory = 'all' \| 'ceremonie' \| 'business' \| 'casual' \| 'party' \| 'beach' \| 'sport' \| 'themes';/, `type StyleCategory = ${styleCats};`);

// Replace CATEGORY_MAP
const catMapRegex = /const CATEGORY_MAP: Record<StyleCategory, { label: string; icon: string; keys: OccasionKey\[\] }> = \{[\s\S]*?^  \};/m;
fileContent = fileContent.replace(catMapRegex, `const CATEGORY_MAP: Record<StyleCategory, { label: string; icon: string; keys: OccasionKey[] }> = {\n${catMap}};`);

fs.writeFileSync('src/components/OccasionStylingPanel.tsx', fileContent);
