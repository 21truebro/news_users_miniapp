export interface DistrictInfo {
  code: string;
  name: string;
  color: string;
}

export const districts: Record<string, DistrictInfo> = {
  'CAO': { code: 'ЦАО', name: 'Центральный', color: '#FF3B30' },
  'SAO': { code: 'САО', name: 'Северный', color: '#007AFF' },
  'SVAO': { code: 'СВАО', name: 'Северо-Восточный', color: '#FC661B' },
  'VAO': { code: 'ВАО', name: 'Восточный', color: '#FFCC00' },
  'UVAO': { code: 'ЮВАО', name: 'Юго-Восточный', color: '#AF52DE' },
  'UAO': { code: 'ЮАО', name: 'Южный', color: '#FF9500' },
  'UZAO': { code: 'ЮЗАО', name: 'Юго-Западный', color: '#34C759' },
  'ZAO': { code: 'ЗАО', name: 'Западный', color: '#8E8E93' },
  'SZAO': { code: 'СЗАО', name: 'Северо-Западный', color: '#5856D6' },
  'ZELAO': { code: 'ЗелАО', name: 'Зеленоградский', color: '#5AC8FA' },
  'TINAO': { code: 'ТиНАО', name: 'Троицкий и Новомосковский', color: '#4CD964' },
};
