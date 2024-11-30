import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Search, X } from 'lucide-react';

interface GlossaryTerm {
  id: string;
  original: string;
  translated: string;
  context?: string;
  category?: string;
}

interface Props {
  onTermSelect: (term: GlossaryTerm) => void;
}

const GlossaryManager: React.FC<Props> = ({ onTermSelect }) => {
  const [terms, setTerms] = useState<GlossaryTerm[]>(() => {
    const saved = localStorage.getItem('glossary-terms');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [newTerm, setNewTerm] = useState({ original: '', translated: '', context: '', category: '' });
  const [isAddingTerm, setIsAddingTerm] = useState(false);

  useEffect(() => {
    localStorage.setItem('glossary-terms', JSON.stringify(terms));
  }, [terms]);

  const filteredTerms = terms.filter(term =>
    term.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.translated.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTerm = () => {
    if (newTerm.original && newTerm.translated) {
      setTerms(prev => [...prev, { ...newTerm, id: Date.now().toString() }]);
      setNewTerm({ original: '', translated: '', context: '', category: '' });
      setIsAddingTerm(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(terms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glossary-terms.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setTerms(prev => [...prev, ...imported]);
        } catch (error) {
          alert('حدث خطأ أثناء استيراد الملف');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white text-stroke-sm">قاموس المصطلحات</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingTerm(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة مصطلح
          </button>
          <button
            onClick={handleExport}
            className="p-2 glass-morphism rounded-xl hover:bg-white/10 transition-all duration-300"
            title="تصدير القاموس"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
          <label className="p-2 glass-morphism rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <Upload className="w-4 h-4 text-white" />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث في المصطلحات..."
          className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
            pl-10"
        />
        <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {isAddingTerm && (
        <div className="glass-morphism rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-white">إضافة مصطلح جديد</h3>
            <button
              onClick={() => setIsAddingTerm(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <input
            type="text"
            value={newTerm.original}
            onChange={(e) => setNewTerm(prev => ({ ...prev, original: e.target.value }))}
            placeholder="النص الأصلي"
            className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          />
          <input
            type="text"
            value={newTerm.translated}
            onChange={(e) => setNewTerm(prev => ({ ...prev, translated: e.target.value }))}
            placeholder="الترجمة"
            className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          />
          <input
            type="text"
            value={newTerm.context}
            onChange={(e) => setNewTerm(prev => ({ ...prev, context: e.target.value }))}
            placeholder="السياق (اختياري)"
            className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          />
          <input
            type="text"
            value={newTerm.category}
            onChange={(e) => setNewTerm(prev => ({ ...prev, category: e.target.value }))}
            placeholder="التصنيف (اختياري)"
            className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
              focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          />
          <button
            onClick={handleAddTerm}
            className="btn-primary w-full"
          >
            إضافة
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredTerms.map(term => (
          <button
            key={term.id}
            onClick={() => onTermSelect(term)}
            className="w-full text-right p-4 rounded-xl glass-morphism hover:bg-white/10 
              transition-all duration-300 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">{term.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-white/90">{term.original}</span>
                <span className="text-white/50">→</span>
                <span className="text-white/90">{term.translated}</span>
              </div>
            </div>
            {term.context && (
              <p className="text-sm text-white/70">{term.context}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlossaryManager;
