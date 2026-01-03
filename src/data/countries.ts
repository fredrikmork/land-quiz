export interface Country {
  name: string
  capital: string
  flag: string // emoji flag
  code: string // ISO 3166-1 alpha-2
}

export const countries: Country[] = [
  { name: 'Norge', capital: 'Oslo', flag: '🇳🇴', code: 'NO' },
  { name: 'Sverige', capital: 'Stockholm', flag: '🇸🇪', code: 'SE' },
  { name: 'Danmark', capital: 'København', flag: '🇩🇰', code: 'DK' },
  { name: 'Finland', capital: 'Helsinki', flag: '🇫🇮', code: 'FI' },
  { name: 'Island', capital: 'Reykjavik', flag: '🇮🇸', code: 'IS' },
  { name: 'Tyskland', capital: 'Berlin', flag: '🇩🇪', code: 'DE' },
  { name: 'Frankrike', capital: 'Paris', flag: '🇫🇷', code: 'FR' },
  { name: 'Spania', capital: 'Madrid', flag: '🇪🇸', code: 'ES' },
  { name: 'Italia', capital: 'Roma', flag: '🇮🇹', code: 'IT' },
  { name: 'Portugal', capital: 'Lisboa', flag: '🇵🇹', code: 'PT' },
  { name: 'Storbritannia', capital: 'London', flag: '🇬🇧', code: 'GB' },
  { name: 'Irland', capital: 'Dublin', flag: '🇮🇪', code: 'IE' },
  { name: 'Nederland', capital: 'Amsterdam', flag: '🇳🇱', code: 'NL' },
  { name: 'Belgia', capital: 'Brussel', flag: '🇧🇪', code: 'BE' },
  { name: 'Sveits', capital: 'Bern', flag: '🇨🇭', code: 'CH' },
  { name: 'Østerrike', capital: 'Wien', flag: '🇦🇹', code: 'AT' },
  { name: 'Polen', capital: 'Warszawa', flag: '🇵🇱', code: 'PL' },
  { name: 'Tsjekkia', capital: 'Praha', flag: '🇨🇿', code: 'CZ' },
  { name: 'Ungarn', capital: 'Budapest', flag: '🇭🇺', code: 'HU' },
  { name: 'Romania', capital: 'Bucuresti', flag: '🇷🇴', code: 'RO' },
  { name: 'Bulgaria', capital: 'Sofia', flag: '🇧🇬', code: 'BG' },
  { name: 'Hellas', capital: 'Athen', flag: '🇬🇷', code: 'GR' },
  { name: 'Tyrkia', capital: 'Ankara', flag: '🇹🇷', code: 'TR' },
  { name: 'Russland', capital: 'Moskva', flag: '🇷🇺', code: 'RU' },
  { name: 'Ukraina', capital: 'Kyiv', flag: '🇺🇦', code: 'UA' },
  { name: 'USA', capital: 'Washington D.C.', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', capital: 'Ottawa', flag: '🇨🇦', code: 'CA' },
  { name: 'Mexico', capital: 'Mexico City', flag: '🇲🇽', code: 'MX' },
  { name: 'Brasil', capital: 'Brasília', flag: '🇧🇷', code: 'BR' },
  { name: 'Argentina', capital: 'Buenos Aires', flag: '🇦🇷', code: 'AR' },
  { name: 'Chile', capital: 'Santiago', flag: '🇨🇱', code: 'CL' },
  { name: 'Colombia', capital: 'Bogotá', flag: '🇨🇴', code: 'CO' },
  { name: 'Peru', capital: 'Lima', flag: '🇵🇪', code: 'PE' },
  { name: 'Japan', capital: 'Tokyo', flag: '🇯🇵', code: 'JP' },
  { name: 'Kina', capital: 'Beijing', flag: '🇨🇳', code: 'CN' },
  { name: 'Sør-Korea', capital: 'Seoul', flag: '🇰🇷', code: 'KR' },
  { name: 'India', capital: 'New Delhi', flag: '🇮🇳', code: 'IN' },
  { name: 'Indonesia', capital: 'Jakarta', flag: '🇮🇩', code: 'ID' },
  { name: 'Thailand', capital: 'Bangkok', flag: '🇹🇭', code: 'TH' },
  { name: 'Vietnam', capital: 'Hanoi', flag: '🇻🇳', code: 'VN' },
  { name: 'Australia', capital: 'Canberra', flag: '🇦🇺', code: 'AU' },
  { name: 'New Zealand', capital: 'Wellington', flag: '🇳🇿', code: 'NZ' },
  { name: 'Egypt', capital: 'Kairo', flag: '🇪🇬', code: 'EG' },
  { name: 'Sør-Afrika', capital: 'Pretoria', flag: '🇿🇦', code: 'ZA' },
  { name: 'Nigeria', capital: 'Abuja', flag: '🇳🇬', code: 'NG' },
  { name: 'Kenya', capital: 'Nairobi', flag: '🇰🇪', code: 'KE' },
  { name: 'Marokko', capital: 'Rabat', flag: '🇲🇦', code: 'MA' },
  { name: 'Saudi-Arabia', capital: 'Riyadh', flag: '🇸🇦', code: 'SA' },
  { name: 'Israel', capital: 'Jerusalem', flag: '🇮🇱', code: 'IL' },
  { name: 'Iran', capital: 'Teheran', flag: '🇮🇷', code: 'IR' },
]

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomCountries(count: number, exclude?: Country): Country[] {
  const available = exclude ? countries.filter(c => c.code !== exclude.code) : countries
  return shuffleArray(available).slice(0, count)
}
