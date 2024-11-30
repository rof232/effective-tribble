import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { DetectedCharacter } from '../lib/types';

interface Props {
  characters: DetectedCharacter[];
  onCharacterUpdate: (name: string, gender: 'male' | 'female') => void;
  onAddCharacter: (name: string) => void;
  onRemoveCharacter: (name: string) => void;
}

export default function CharacterPronouns({ 
  characters, 
  onCharacterUpdate, 
  onAddCharacter,
  onRemoveCharacter 
}: Props) {
  const [newCharacterName, setNewCharacterName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCharacterName.trim()) {
      onAddCharacter(newCharacterName.trim());
      setNewCharacterName('');
      setIsAdding(false);
    }
  };

  if (!isAdding && characters.length === 0) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full bg-white rounded-lg shadow-lg p-4 mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-indigo-600" />
        <span className="text-gray-700">إضافة شخصية</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">ضمائر الشخصيات</h3>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" />
            إضافة شخصية
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              placeholder="اسم الشخصية"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              إضافة
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
      
      <div className="space-y-3">
        {characters.map((character) => (
          <div key={character.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-700">{character.name}</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onCharacterUpdate(character.name, 'male')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    character.gender === 'male'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  مذكر
                </button>
                <button
                  onClick={() => onCharacterUpdate(character.name, 'female')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    character.gender === 'female'
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  مؤنث
                </button>
              </div>
              <button
                onClick={() => onRemoveCharacter(character.name)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="حذف الشخصية"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}