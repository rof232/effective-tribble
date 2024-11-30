import React, { useState } from 'react';
import { Bot, ChevronDown } from 'lucide-react';
import { AI_PROVIDERS } from '../lib/ai-providers';
import type { AIProvider, AISettings } from '../lib/types';

interface Props {
  settings: AISettings;
  onUpdate: (settings: Partial<AISettings>) => void;
}

export default function AIProviderSelector({ settings, onUpdate }: Props) {
  const [isCustomModel, setIsCustomModel] = useState(false);
  const provider = AI_PROVIDERS[settings.provider];

  const handleProviderChange = (newProvider: AIProvider) => {
    const firstModel = AI_PROVIDERS[newProvider].models[0]?.id;
    onUpdate({ 
      provider: newProvider,
      model: firstModel || ''
    });
    setIsCustomModel(false);
  };

  const handleModelChange = (modelId: string) => {
    if (modelId === 'custom') {
      setIsCustomModel(true);
    } else {
      setIsCustomModel(false);
      onUpdate({ model: modelId });
    }
  };

  const selectClasses = `w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl 
    border border-white/20 shadow-sm text-white appearance-none cursor-pointer 
    hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-white/30`;
    
  const inputClasses = `w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl 
    border border-white/20 shadow-sm text-white transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/50`;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2 text-stroke-sm">
          <Bot className="w-4 h-4" />
          مزود الذكاء الاصطناعي
        </label>
        <div className="relative group">
          <select
            value={settings.provider}
            onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            className={selectClasses}
          >
            {Object.entries(AI_PROVIDERS).map(([id, config]) => (
              <option key={id} value={id} className="bg-gray-900 text-white">
                {config.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
            text-white/70 pointer-events-none group-hover:text-white 
            transition-colors duration-300" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2 text-stroke-sm">
          النموذج
        </label>
        {provider.customModelSupport ? (
          <div className="space-y-3">
            <div className="relative group">
              <select
                value={isCustomModel ? 'custom' : settings.model}
                onChange={(e) => handleModelChange(e.target.value)}
                className={selectClasses}
              >
                {provider.models.map(model => (
                  <option key={model.id} value={model.id} className="bg-gray-900 text-white">
                    {model.name}
                  </option>
                ))}
                <option value="custom" className="bg-gray-900 text-white">نموذج مخصص</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                text-white/70 pointer-events-none group-hover:text-white 
                transition-colors duration-300" />
            </div>
            
            {isCustomModel && (
              <input
                type="text"
                value={settings.model}
                onChange={(e) => onUpdate({ model: e.target.value })}
                placeholder="أدخل اسم النموذج المخصص"
                className={inputClasses}
              />
            )}
          </div>
        ) : (
          <div className="relative group">
            <select
              value={settings.model}
              onChange={(e) => onUpdate({ model: e.target.value })}
              className={selectClasses}
            >
              {provider.models.map(model => (
                <option key={model.id} value={model.id} className="bg-gray-900 text-white">
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
              text-white/70 pointer-events-none group-hover:text-white 
              transition-colors duration-300" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2 text-stroke-sm">
          مفتاح API
        </label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => onUpdate({ apiKey: e.target.value })}
          placeholder={`أدخل مفتاح ${provider.name} API`}
          className={inputClasses}
          required
        />
      </div>
    </div>
  );
}