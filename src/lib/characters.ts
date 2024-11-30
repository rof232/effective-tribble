const CHARACTERS_STORAGE_KEY = 'translation_characters';

export const getStoredCharacters = (): Record<string, 'male' | 'female'> => {
  const stored = localStorage.getItem(CHARACTERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const storeCharacter = (name: string, gender: 'male' | 'female') => {
  const characters = getStoredCharacters();
  characters[name.toLowerCase()] = gender;
  localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(characters));
};

export const removeCharacter = (name: string) => {
  const characters = getStoredCharacters();
  delete characters[name.toLowerCase()];
  localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(characters));
};