import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AISettings } from '../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: AISettings) => void;
  initialSettings: AISettings;
}

const ApiKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<AISettings>(initialSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-morphism rounded-2xl w-full max-w-lg p-6 shadow-2xl scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white text-stroke-sm">
            إعدادات API
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-white text-stroke-sm">مزود الخدمة</label>
            <select
              value={settings.provider}
              onChange={(e) =>
                setSettings({ ...settings, provider: e.target.value })
              }
              className="w-full p-3 rounded-xl glass-morphism text-white 
                focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google AI</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-white text-stroke-sm">النموذج</label>
            <select
              value={settings.model}
              onChange={(e) =>
                setSettings({ ...settings, model: e.target.value })
              }
              className="w-full p-3 rounded-xl glass-morphism text-white 
                focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
            >
              {settings.provider === 'openai' && (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {settings.provider === 'anthropic' && (
                <>
                  <option value="claude-2">Claude 2</option>
                  <option value="claude-instant">Claude Instant</option>
                </>
              )}
              {settings.provider === 'google' && (
                <>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="palm2">PaLM 2</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-white text-stroke-sm">مفتاح API</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
              placeholder="أدخل مفتاح API الخاص بك..."
              className="w-full p-3 rounded-xl glass-morphism text-white placeholder-white/50
                focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;