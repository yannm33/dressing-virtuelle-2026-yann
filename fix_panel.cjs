const fs = require('fs');

let fileContent = fs.readFileSync('src/components/OccasionStylingPanel.tsx', 'utf8');

// Find the CATEGORY_MAP end.
const catMapEndIndex = fileContent.indexOf('};', fileContent.indexOf('cat_adapte: {'));
console.log("catMapEndIndex", catMapEndIndex);

const firstPart = fileContent.substring(0, catMapEndIndex + 2);

const missingCode = `
const OccasionStylingPanel: React.FC<OccasionStylingPanelProps> = ({ 
  onGenerateOutfit, 
  isLoading, 
  numImagesToGenerate, 
  onNumImagesChange 
}) => {
  const { t } = useLocalization();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>('cat_noel_reveillon_elegant');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('cat_noel');

  const filteredOccasions = useMemo(() => {
    let list = activeCategory === 'all' 
      ? CATEGORY_MAP.all.keys 
      : CATEGORY_MAP[activeCategory].keys;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((key) => {
        const translated = t(key).toLowerCase();
        return translated.includes(q) || key.toLowerCase().includes(q);
      });
    }

    return list;
  }, [activeCategory, searchQuery, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateOutfit(selectedOccasion);
  };
`;

const secondPartStart = fileContent.indexOf('  const currentOccasionLabel = t(selectedOccasion);');
const secondPart = fileContent.substring(secondPartStart);

fs.writeFileSync('src/components/OccasionStylingPanel.tsx', firstPart + missingCode + secondPart);
