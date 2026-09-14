const fs = require('fs');
let fileContent = fs.readFileSync('src/components/OccasionStylingPanel.tsx', 'utf8');

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

fileContent = fileContent.replace('};  const currentOccasionLabel = t(selectedOccasion);', '};\n' + missingCode + '\n  const currentOccasionLabel = t(selectedOccasion);');

fs.writeFileSync('src/components/OccasionStylingPanel.tsx', fileContent);
