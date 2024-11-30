# دليل المساهمة في المترجم الذكي 📚

<div dir="rtl">

## هيكل المشروع 🏗️

```
silver-enigma/
├── src/                      # المصدر الرئيسي للتطبيق
│   ├── components/           # مكونات React
│   │   ├── AIProviderSelector.tsx    # اختيار مزود الذكاء الاصطناعي
│   │   ├── ApiKeyModal.tsx           # نافذة إدارة مفاتيح API
│   │   ├── CharacterPronouns.tsx     # إدارة ضمائر الشخصيات
│   │   ├── ChapterManager.tsx        # إدارة فصول الرواية
│   │   ├── GlossaryManager.tsx       # إدارة المصطلحات
│   │   ├── LanguageSelector.tsx      # اختيار اللغات
│   │   ├── TextFormatting.tsx        # أدوات تنسيق النص
│   │   └── TranslationHistory.tsx    # سجل الترجمات
│   ├── lib/                  # المكتبات والأدوات المساعدة
│   │   ├── ai-service.ts     # خدمات الذكاء الاصطناعي
│   │   ├── characters.ts     # إدارة الشخصيات
│   │   └── types.ts          # التعريفات والأنواع
│   ├── App.tsx               # المكون الرئيسي
│   └── index.css             # الأنماط العامة
└── package.json              # تبعيات المشروع
```

## شرح المكونات الرئيسية 🔍

### 1. App.tsx - المكون الرئيسي
```typescript
// المكون الرئيسي للتطبيق
function App() {
  // حالة الترجمة
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  // إعدادات اللغة
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('ar');
  
  // إدارة الشخصيات والمصطلحات
  const [characters, setCharacters] = useState<DetectedCharacter[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  
  // ... المزيد من المنطق والوظائف
}
```

### 2. مكونات الترجمة

#### TextFormatting.tsx - تنسيق النص
```typescript
// مكون تنسيق النص
const TextFormatting: React.FC<Props> = ({ text, onTextChange }) => {
  // أنواع التنسيق المدعومة
  const [formatType, setFormatType] = useState<'html' | 'bbcode' | 'markdown'>('html');
  
  // تطبيق التنسيق على النص المحدد
  const applyFormat = (format: string) => {
    // تنسيق النص حسب النوع المختار
  };
}
```

#### ChapterManager.tsx - إدارة الفصول
```typescript
// مكون إدارة الفصول
const ChapterManager: React.FC<Props> = ({ onTranslate }) => {
  // قائمة الفصول
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  // حفظ الفصول محلياً
  const saveChapters = (updatedChapters: Chapter[]) => {
    localStorage.setItem('translation-chapters', JSON.stringify(updatedChapters));
  };
}
```

### 3. خدمات الذكاء الاصطناعي

#### ai-service.ts
```typescript
// مزودو خدمة الترجمة
export class AIService {
  // إعداد مزود الخدمة
  constructor(private provider: 'openai' | 'anthropic', private apiKey: string) {}
  
  // ترجمة النص
  async translate(text: string, from: string, to: string): Promise<string> {
    // تنفيذ الترجمة حسب المزود المختار
  }
}
```

## الأنماط والتصميم 🎨

### index.css
```css
/* المتغيرات العامة */
:root {
  /* ألوان الوضع الليلي */
  --bg-dark: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

/* تأثيرات زجاجية */
.glass-morphism {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}
```

## الميزات الرئيسية وكيفية عملها 🛠️

### 1. نظام الترجمة
- استخدام واجهات برمجة AI للترجمة
- معالجة السياق والضمائر
- حفظ سجل الترجمات

### 2. إدارة الفصول
- تخزين محلي للفصول
- ترجمة تلقائية
- تتبع حالة الترجمة

### 3. إدارة المصطلحات
- قاموس مصطلحات قابل للتخصيص
- استيراد/تصدير المصطلحات
- البحث السريع

### 4. تنسيق النص
- دعم HTML/BBCode/Markdown
- تنسيق تلقائي للفقرات
- أدوات تنسيق سهلة الاستخدام

## أفضل الممارسات للمساهمة 👥

### 1. كتابة الكود
```typescript
// ✅ جيد
function translateText(text: string): Promise<string> {
  // التعليقات توضح المنطق المعقد
  return aiService.translate(text);
}

// ❌ سيء
function t(x: string): Promise<string> {
  return a.t(x);
}
```

### 2. التعليقات والتوثيق
```typescript
/**
 * ترجمة نص مع مراعاة السياق والضمائر
 * @param text النص المراد ترجمته
 * @param context معلومات السياق
 * @returns النص المترجم
 */
function translateWithContext(text: string, context: Context): Promise<string>
```

### 3. التنظيم والهيكلة
- فصل المنطق عن العرض
- استخدام مكونات قابلة لإعادة الاستخدام
- تنظيم الملفات حسب الوظيفة

## إرشادات المساهمة 📝

1. **تجهيز البيئة المحلية**:
   ```bash
   # تثبيت التبعيات
   npm install
   
   # تشغيل بيئة التطوير
   npm run dev
   ```

2. **إضافة ميزات جديدة**:
   - إنشاء فرع جديد
   - كتابة اختبارات
   - تحديث الوثائق

3. **تقديم التغييرات**:
   - وصف واضح للتغييرات
   - إضافة اختبارات
   - تحديث CHANGELOG.md

</div>

---

<div dir="ltr">

## Quick Reference 🚀

### Commands
```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

### Common Files
- `App.tsx`: Main application component
- `index.css`: Global styles
- `ai-service.ts`: AI translation services
- `types.ts`: TypeScript definitions

</div>
