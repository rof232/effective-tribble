/**
 * مكون إدارة الفصول
 * يوفر واجهة لإدارة وترجمة فصول الروايات
 */

import React, { useState } from 'react';
import { Save, FileText, Loader2 } from 'lucide-react';

/**
 * نموذج الفصل
 * @property id - معرف فريد للفصل
 * @property title - عنوان الفصل
 * @property content - محتوى الفصل
 * @property translatedTitle - العنوان المترجم (اختياري)
 * @property translatedContent - المحتوى المترجم (اختياري)
 * @property status - حالة الفصل (مسودة/مكتمل)
 * @property lastModified - تاريخ آخر تعديل
 */
interface Chapter {
  id: string;
  title: string;
  content: string;
  translatedTitle?: string;
  translatedContent?: string;
  status: 'draft' | 'completed';
  lastModified: Date;
}

/**
 * خصائص المكون
 * @property onTranslate - دالة للترجمة تستخدم خدمة الذكاء الاصطناعي
 */
interface Props {
  onTranslate: (text: string) => Promise<string>;
}

/**
 * مكون إدارة الفصول
 * يدير قائمة الفصول مع إمكانيات الترجمة والتخزين
 */
const ChapterManager: React.FC<Props> = ({ onTranslate }) => {
  // حالة الفصول والفصل الحالي
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('translation-chapters');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  /**
   * حفظ الفصول في التخزين المحلي
   */
  const saveChapters = (updatedChapters: Chapter[]) => {
    setChapters(updatedChapters);
    localStorage.setItem('translation-chapters', JSON.stringify(updatedChapters));
  };

  /**
   * إنشاء فصل جديد
   */
  const handleNewChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'فصل جديد',
      content: '',
      status: 'draft',
      lastModified: new Date()
    };
    saveChapters([...chapters, newChapter]);
    setCurrentChapter(newChapter);
  };

  /**
   * حفظ الفصل الحالي
   */
  const handleSaveChapter = () => {
    if (!currentChapter) return;
    
    const updatedChapters = chapters.map(chapter =>
      chapter.id === currentChapter.id ? currentChapter : chapter
    );
    saveChapters(updatedChapters);
  };

  /**
   * ترجمة الفصل الحالي
   * يترجم العنوان والمحتوى باستخدام خدمة الترجمة
   */
  const handleTranslateChapter = async () => {
    if (!currentChapter || isTranslating) return;
    
    setIsTranslating(true);
    try {
      // ترجمة العنوان
      const translatedTitle = await onTranslate(currentChapter.title);
      
      // تقسيم المحتوى إلى فقرات وترجمة كل فقرة
      const paragraphs = currentChapter.content.split('\n\n');
      const translatedParagraphs = await Promise.all(
        paragraphs.map(p => p.trim() ? onTranslate(p) : '')
      );
      
      const updatedChapter = {
        ...currentChapter,
        translatedTitle,
        translatedContent: translatedParagraphs.join('\n\n'),
        lastModified: new Date()
      };
      
      setCurrentChapter(updatedChapter);
      const updatedChapters = chapters.map(chapter =>
        chapter.id === updatedChapter.id ? updatedChapter : chapter
      );
      saveChapters(updatedChapters);
    } catch (error) {
      console.error('Translation error:', error);
      alert('حدث خطأ أثناء الترجمة');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 space-y-6">
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white text-stroke-sm">إدارة الفصول</h2>
        <button
          onClick={handleNewChapter}
          className="btn-primary"
        >
          فصل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الفصول */}
        <div className="glass-morphism rounded-xl p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {chapters.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => setCurrentChapter(chapter)}
              className={`w-full text-right p-4 rounded-xl transition-all duration-300 ${
                currentChapter?.id === chapter.id
                  ? 'bg-white/20'
                  : 'glass-morphism hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">
                  {new Date(chapter.lastModified).toLocaleDateString('ar-SA')}
                </span>
                <h3 className="text-white font-medium">{chapter.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  chapter.status === 'completed'
                    ? 'bg-green-500/20 text-green-200'
                    : 'bg-yellow-500/20 text-yellow-200'
                }`}>
                  {chapter.status === 'completed' ? 'مكتمل' : 'مسودة'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* محرر الفصل */}
        {currentChapter ? (
          <div className="lg:col-span-2 space-y-4">
            {/* شريط الأدوات */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveChapter}
                  className="btn-secondary flex items-center gap-2"
                  title="حفظ"
                >
                  <Save className="w-4 h-4" />
                  حفظ
                </button>
                <button
                  onClick={handleTranslateChapter}
                  disabled={isTranslating}
                  className="btn-primary flex items-center gap-2"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الترجمة...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      ترجمة الفصل
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* حقول التحرير */}
            <input
              type="text"
              value={currentChapter.title}
              onChange={(e) => setCurrentChapter({ ...currentChapter, title: e.target.value })}
              placeholder="عنوان الفصل"
              className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />

            {currentChapter.translatedTitle && (
              <input
                type="text"
                value={currentChapter.translatedTitle}
                onChange={(e) => setCurrentChapter({ ...currentChapter, translatedTitle: e.target.value })}
                placeholder="العنوان المترجم"
                className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
                  focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
              />
            )}

            {/* محرر النص الأصلي والمترجم */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <textarea
                  value={currentChapter.content}
                  onChange={(e) => setCurrentChapter({ ...currentChapter, content: e.target.value })}
                  placeholder="محتوى الفصل الأصلي..."
                  className="w-full h-[400px] p-4 rounded-xl glass-morphism text-white placeholder-white/50
                    focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
                    custom-scrollbar resize-none"
                />
              </div>

              <div className="space-y-2">
                <textarea
                  value={currentChapter.translatedContent}
                  onChange={(e) => setCurrentChapter({ ...currentChapter, translatedContent: e.target.value })}
                  placeholder="الترجمة..."
                  className="w-full h-[400px] p-4 rounded-xl glass-morphism text-white placeholder-white/50
                    focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
                    custom-scrollbar resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center h-[600px] glass-morphism rounded-xl">
            <p className="text-white/70">اختر فصلاً أو قم بإنشاء فصل جديد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterManager;
