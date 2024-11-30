/**
 * مكون تنسيق النص
 * يوفر أدوات لتنسيق النص بأنماط مختلفة (HTML, BBCode, Markdown)
 */

import React, { useState } from 'react';
import { Type, Code, AlignLeft } from 'lucide-react';

/**
 * خصائص المكون
 * @property text - النص المراد تنسيقه
 * @property onTextChange - دالة تُستدعى عند تغيير النص
 */
interface Props {
  text: string;
  onTextChange: (text: string) => void;
}

/** أنواع التنسيق المدعومة */
type FormatType = 'html' | 'bbcode' | 'markdown';

/**
 * مكون تنسيق النص
 * يوفر واجهة سهلة لتطبيق التنسيقات المختلفة على النص
 */
const TextFormatting: React.FC<Props> = ({ text, onTextChange }) => {
  // نوع التنسيق الحالي
  const [formatType, setFormatType] = useState<FormatType>('html');

  /**
   * تطبيق تنسيق معين على النص المحدد
   * @param format - نوع التنسيق (bold, italic, quote)
   */
  const applyFormat = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = formatType === 'html' ? `<strong>${selectedText}</strong>` :
          formatType === 'bbcode' ? `[b]${selectedText}[/b]` :
          `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = formatType === 'html' ? `<em>${selectedText}</em>` :
          formatType === 'bbcode' ? `[i]${selectedText}[/i]` :
          `*${selectedText}*`;
        break;
      case 'quote':
        formattedText = formatType === 'html' ? `<blockquote>${selectedText}</blockquote>` :
          formatType === 'bbcode' ? `[quote]${selectedText}[/quote]` :
          `> ${selectedText}`;
        break;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    onTextChange(newText);
  };

  /**
   * تنسيق الفقرات في النص
   * يضيف علامات الفقرات المناسبة حسب نوع التنسيق المختار
   */
  const formatParagraphs = () => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    let formatted = '';

    switch (formatType) {
      case 'html':
        formatted = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n');
        break;
      case 'bbcode':
        formatted = paragraphs.map(p => `[p]${p.trim()}[/p]`).join('\n');
        break;
      case 'markdown':
        formatted = paragraphs.map(p => p.trim()).join('\n\n');
        break;
    }

    onTextChange(formatted);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* شريط أدوات التنسيق */}
      <div className="glass-morphism rounded-xl p-2 flex items-center gap-2">
        {/* زر الخط العريض */}
        <button
          onClick={() => applyFormat('bold')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="خط عريض"
        >
          <Type className="w-5 h-5 text-white" />
        </button>

        {/* زر الخط المائل */}
        <button
          onClick={() => applyFormat('italic')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="خط مائل"
        >
          <Type className="w-5 h-5 text-white italic" />
        </button>

        {/* زر الاقتباس */}
        <button
          onClick={() => applyFormat('quote')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="اقتباس"
        >
          <AlignLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20" />

        {/* زر تنسيق الفقرات */}
        <button
          onClick={formatParagraphs}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="تنسيق الفقرات"
        >
          <Code className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* اختيار نوع التنسيق */}
      <select
        value={formatType}
        onChange={(e) => setFormatType(e.target.value as FormatType)}
        className="p-2 rounded-xl glass-morphism text-white 
          focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300
          appearance-none bg-transparent cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1rem',
          paddingRight: '2rem'
        }}
      >
        <option value="html" className="bg-[#1a1a2e]">HTML</option>
        <option value="bbcode" className="bg-[#1a1a2e]">BBCode</option>
        <option value="markdown" className="bg-[#1a1a2e]">Markdown</option>
      </select>
    </div>
  );
};

export default TextFormatting;
