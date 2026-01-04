export type Continent = 'Europa' | 'Asia' | 'Afrika' | 'Nord-Amerika' | 'Sør-Amerika' | 'Oseania'

export interface Country {
  name: string
  capital: string
  code: string
  continent: Continent
}

// Generer flagg-URL fra landkode (bruker flagcdn.com)
export function getFlagUrl(code: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const width = size === 'small' ? 40 : size === 'medium' ? 80 : 160
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`
}

export function getFlagSvgUrl(code: string): string {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`
}

export const countries: Country[] = [
  // ============================================
  // EUROPA (44 land)
  // ============================================
  { name: 'Albania', capital: 'Tirana', code: 'AL', continent: 'Europa' },
  { name: 'Andorra', capital: 'Andorra la Vella', code: 'AD', continent: 'Europa' },
  { name: 'Belgia', capital: 'Brussel', code: 'BE', continent: 'Europa' },
  { name: 'Bosnia-Hercegovina', capital: 'Sarajevo', code: 'BA', continent: 'Europa' },
  { name: 'Bulgaria', capital: 'Sofia', code: 'BG', continent: 'Europa' },
  { name: 'Danmark', capital: 'København', code: 'DK', continent: 'Europa' },
  { name: 'Estland', capital: 'Tallinn', code: 'EE', continent: 'Europa' },
  { name: 'Finland', capital: 'Helsinki', code: 'FI', continent: 'Europa' },
  { name: 'Frankrike', capital: 'Paris', code: 'FR', continent: 'Europa' },
  { name: 'Hellas', capital: 'Athen', code: 'GR', continent: 'Europa' },
  { name: 'Belarus', capital: 'Minsk', code: 'BY', continent: 'Europa' },
  { name: 'Irland', capital: 'Dublin', code: 'IE', continent: 'Europa' },
  { name: 'Island', capital: 'Reykjavik', code: 'IS', continent: 'Europa' },
  { name: 'Italia', capital: 'Roma', code: 'IT', continent: 'Europa' },
  { name: 'Kosovo', capital: 'Pristina', code: 'XK', continent: 'Europa' },
  { name: 'Kroatia', capital: 'Zagreb', code: 'HR', continent: 'Europa' },
  { name: 'Kypros', capital: 'Nikosia', code: 'CY', continent: 'Europa' },
  { name: 'Latvia', capital: 'Riga', code: 'LV', continent: 'Europa' },
  { name: 'Liechtenstein', capital: 'Vaduz', code: 'LI', continent: 'Europa' },
  { name: 'Litauen', capital: 'Vilnius', code: 'LT', continent: 'Europa' },
  { name: 'Luxembourg', capital: 'Luxembourg', code: 'LU', continent: 'Europa' },
  { name: 'Malta', capital: 'Valletta', code: 'MT', continent: 'Europa' },
  { name: 'Moldova', capital: 'Chisinau', code: 'MD', continent: 'Europa' },
  { name: 'Monaco', capital: 'Monaco', code: 'MC', continent: 'Europa' },
  { name: 'Montenegro', capital: 'Podgorica', code: 'ME', continent: 'Europa' },
  { name: 'Nederland', capital: 'Amsterdam', code: 'NL', continent: 'Europa' },
  { name: 'Nord-Makedonia', capital: 'Skopje', code: 'MK', continent: 'Europa' },
  { name: 'Norge', capital: 'Oslo', code: 'NO', continent: 'Europa' },
  { name: 'Polen', capital: 'Warszawa', code: 'PL', continent: 'Europa' },
  { name: 'Portugal', capital: 'Lisboa', code: 'PT', continent: 'Europa' },
  { name: 'Romania', capital: 'Bucuresti', code: 'RO', continent: 'Europa' },
  { name: 'Russland', capital: 'Moskva', code: 'RU', continent: 'Europa' },
  { name: 'San Marino', capital: 'San Marino', code: 'SM', continent: 'Europa' },
  { name: 'Serbia', capital: 'Beograd', code: 'RS', continent: 'Europa' },
  { name: 'Slovakia', capital: 'Bratislava', code: 'SK', continent: 'Europa' },
  { name: 'Slovenia', capital: 'Ljubljana', code: 'SI', continent: 'Europa' },
  { name: 'Spania', capital: 'Madrid', code: 'ES', continent: 'Europa' },
  { name: 'Storbritannia', capital: 'London', code: 'GB', continent: 'Europa' },
  { name: 'Sverige', capital: 'Stockholm', code: 'SE', continent: 'Europa' },
  { name: 'Sveits', capital: 'Bern', code: 'CH', continent: 'Europa' },
  { name: 'Tsjekkia', capital: 'Praha', code: 'CZ', continent: 'Europa' },
  { name: 'Tyskland', capital: 'Berlin', code: 'DE', continent: 'Europa' },
  { name: 'Ukraina', capital: 'Kyiv', code: 'UA', continent: 'Europa' },
  { name: 'Ungarn', capital: 'Budapest', code: 'HU', continent: 'Europa' },
  { name: 'Vatikanstaten', capital: 'Vatikanstaten', code: 'VA', continent: 'Europa' },
  { name: 'Østerrike', capital: 'Wien', code: 'AT', continent: 'Europa' },

  // ============================================
  // ASIA (49 land)
  // ============================================
  { name: 'Afghanistan', capital: 'Kabul', code: 'AF', continent: 'Asia' },
  { name: 'Armenia', capital: 'Jerevan', code: 'AM', continent: 'Asia' },
  { name: 'Aserbajdsjan', capital: 'Baku', code: 'AZ', continent: 'Asia' },
  { name: 'Bahrain', capital: 'Manama', code: 'BH', continent: 'Asia' },
  { name: 'Bangladesh', capital: 'Dhaka', code: 'BD', continent: 'Asia' },
  { name: 'Bhutan', capital: 'Thimphu', code: 'BT', continent: 'Asia' },
  { name: 'Brunei', capital: 'Bandar Seri Begawan', code: 'BN', continent: 'Asia' },
  { name: 'Filippinene', capital: 'Manila', code: 'PH', continent: 'Asia' },
  { name: 'De forente arabiske emirater', capital: 'Abu Dhabi', code: 'AE', continent: 'Asia' },
  { name: 'Georgia', capital: 'Tbilisi', code: 'GE', continent: 'Asia' },
  { name: 'India', capital: 'New Delhi', code: 'IN', continent: 'Asia' },
  { name: 'Indonesia', capital: 'Jakarta', code: 'ID', continent: 'Asia' },
  { name: 'Irak', capital: 'Bagdad', code: 'IQ', continent: 'Asia' },
  { name: 'Iran', capital: 'Teheran', code: 'IR', continent: 'Asia' },
  { name: 'Israel', capital: 'Jerusalem', code: 'IL', continent: 'Asia' },
  { name: 'Japan', capital: 'Tokyo', code: 'JP', continent: 'Asia' },
  { name: 'Jemen', capital: 'Sanaa', code: 'YE', continent: 'Asia' },
  { name: 'Jordan', capital: 'Amman', code: 'JO', continent: 'Asia' },
  { name: 'Kambodsja', capital: 'Phnom Penh', code: 'KH', continent: 'Asia' },
  { name: 'Kasakhstan', capital: 'Astana', code: 'KZ', continent: 'Asia' },
  { name: 'Kina', capital: 'Beijing', code: 'CN', continent: 'Asia' },
  { name: 'Kirgisistan', capital: 'Bisjkek', code: 'KG', continent: 'Asia' },
  { name: 'Kuwait', capital: 'Kuwait by', code: 'KW', continent: 'Asia' },
  { name: 'Laos', capital: 'Vientiane', code: 'LA', continent: 'Asia' },
  { name: 'Libanon', capital: 'Beirut', code: 'LB', continent: 'Asia' },
  { name: 'Malaysia', capital: 'Kuala Lumpur', code: 'MY', continent: 'Asia' },
  { name: 'Maldivene', capital: 'Malé', code: 'MV', continent: 'Asia' },
  { name: 'Mongolia', capital: 'Ulaanbaatar', code: 'MN', continent: 'Asia' },
  { name: 'Myanmar', capital: 'Naypyidaw', code: 'MM', continent: 'Asia' },
  { name: 'Nepal', capital: 'Katmandu', code: 'NP', continent: 'Asia' },
  { name: 'Nord-Korea', capital: 'Pyongyang', code: 'KP', continent: 'Asia' },
  { name: 'Oman', capital: 'Muskat', code: 'OM', continent: 'Asia' },
  { name: 'Pakistan', capital: 'Islamabad', code: 'PK', continent: 'Asia' },
  { name: 'Palestina', capital: 'Ramallah', code: 'PS', continent: 'Asia' },
  { name: 'Qatar', capital: 'Doha', code: 'QA', continent: 'Asia' },
  { name: 'Saudi-Arabia', capital: 'Riyadh', code: 'SA', continent: 'Asia' },
  { name: 'Singapore', capital: 'Singapore', code: 'SG', continent: 'Asia' },
  { name: 'Sri Lanka', capital: 'Colombo', code: 'LK', continent: 'Asia' },
  { name: 'Syria', capital: 'Damaskus', code: 'SY', continent: 'Asia' },
  { name: 'Sør-Korea', capital: 'Seoul', code: 'KR', continent: 'Asia' },
  { name: 'Tadsjikistan', capital: 'Dusjanbe', code: 'TJ', continent: 'Asia' },
  { name: 'Taiwan', capital: 'Taipei', code: 'TW', continent: 'Asia' },
  { name: 'Thailand', capital: 'Bangkok', code: 'TH', continent: 'Asia' },
  { name: 'Timor-Leste', capital: 'Dili', code: 'TL', continent: 'Asia' },
  { name: 'Turkmenistan', capital: 'Asjkhabad', code: 'TM', continent: 'Asia' },
  { name: 'Tyrkia', capital: 'Ankara', code: 'TR', continent: 'Europa' },
  { name: 'Usbekistan', capital: 'Tasjkent', code: 'UZ', continent: 'Asia' },
  { name: 'Vietnam', capital: 'Hanoi', code: 'VN', continent: 'Asia' },

  // ============================================
  // AFRIKA (54 land)
  // ============================================
  { name: 'Algeria', capital: 'Alger', code: 'DZ', continent: 'Afrika' },
  { name: 'Angola', capital: 'Luanda', code: 'AO', continent: 'Afrika' },
  { name: 'Benin', capital: 'Porto-Novo', code: 'BJ', continent: 'Afrika' },
  { name: 'Botswana', capital: 'Gaborone', code: 'BW', continent: 'Afrika' },
  { name: 'Burkina Faso', capital: 'Ouagadougou', code: 'BF', continent: 'Afrika' },
  { name: 'Burundi', capital: 'Gitega', code: 'BI', continent: 'Afrika' },
  { name: 'Kamerun', capital: 'Yaoundé', code: 'CM', continent: 'Afrika' },
  { name: 'Kapp Verde', capital: 'Praia', code: 'CV', continent: 'Afrika' },
  { name: 'Den sentralafrikanske republikk', capital: 'Bangui', code: 'CF', continent: 'Afrika' },
  { name: 'Tsjad', capital: "N'Djamena", code: 'TD', continent: 'Afrika' },
  { name: 'Komorene', capital: 'Moroni', code: 'KM', continent: 'Afrika' },
  { name: 'Republikken Kongo', capital: 'Brazzaville', code: 'CG', continent: 'Afrika' },
  { name: 'Den demokratiske republikken Kongo', capital: 'Kinshasa', code: 'CD', continent: 'Afrika' },
  { name: 'Elfenbenskysten', capital: 'Yamoussoukro', code: 'CI', continent: 'Afrika' },
  { name: 'Djibouti', capital: 'Djibouti', code: 'DJ', continent: 'Afrika' },
  { name: 'Egypt', capital: 'Kairo', code: 'EG', continent: 'Afrika' },
  { name: 'Ekvatorial-Guinea', capital: 'Malabo', code: 'GQ', continent: 'Afrika' },
  { name: 'Eritrea', capital: 'Asmara', code: 'ER', continent: 'Afrika' },
  { name: 'Eswatini', capital: 'Mbabane', code: 'SZ', continent: 'Afrika' },
  { name: 'Etiopia', capital: 'Addis Abeba', code: 'ET', continent: 'Afrika' },
  { name: 'Gabon', capital: 'Libreville', code: 'GA', continent: 'Afrika' },
  { name: 'Gambia', capital: 'Banjul', code: 'GM', continent: 'Afrika' },
  { name: 'Ghana', capital: 'Accra', code: 'GH', continent: 'Afrika' },
  { name: 'Guinea', capital: 'Conakry', code: 'GN', continent: 'Afrika' },
  { name: 'Guinea-Bissau', capital: 'Bissau', code: 'GW', continent: 'Afrika' },
  { name: 'Kenya', capital: 'Nairobi', code: 'KE', continent: 'Afrika' },
  { name: 'Lesotho', capital: 'Maseru', code: 'LS', continent: 'Afrika' },
  { name: 'Liberia', capital: 'Monrovia', code: 'LR', continent: 'Afrika' },
  { name: 'Libya', capital: 'Tripoli', code: 'LY', continent: 'Afrika' },
  { name: 'Madagaskar', capital: 'Antananarivo', code: 'MG', continent: 'Afrika' },
  { name: 'Malawi', capital: 'Lilongwe', code: 'MW', continent: 'Afrika' },
  { name: 'Mali', capital: 'Bamako', code: 'ML', continent: 'Afrika' },
  { name: 'Mauritania', capital: 'Nouakchott', code: 'MR', continent: 'Afrika' },
  { name: 'Mauritius', capital: 'Port Louis', code: 'MU', continent: 'Afrika' },
  { name: 'Marokko', capital: 'Rabat', code: 'MA', continent: 'Afrika' },
  { name: 'Mosambik', capital: 'Maputo', code: 'MZ', continent: 'Afrika' },
  { name: 'Namibia', capital: 'Windhoek', code: 'NA', continent: 'Afrika' },
  { name: 'Niger', capital: 'Niamey', code: 'NE', continent: 'Afrika' },
  { name: 'Nigeria', capital: 'Abuja', code: 'NG', continent: 'Afrika' },
  { name: 'Rwanda', capital: 'Kigali', code: 'RW', continent: 'Afrika' },
  { name: 'São Tomé og Príncipe', capital: 'São Tomé', code: 'ST', continent: 'Afrika' },
  { name: 'Senegal', capital: 'Dakar', code: 'SN', continent: 'Afrika' },
  { name: 'Seychellene', capital: 'Victoria', code: 'SC', continent: 'Afrika' },
  { name: 'Sierra Leone', capital: 'Freetown', code: 'SL', continent: 'Afrika' },
  { name: 'Somalia', capital: 'Mogadishu', code: 'SO', continent: 'Afrika' },
  { name: 'Sør-Afrika', capital: 'Pretoria', code: 'ZA', continent: 'Afrika' },
  { name: 'Sør-Sudan', capital: 'Juba', code: 'SS', continent: 'Afrika' },
  { name: 'Sudan', capital: 'Khartoum', code: 'SD', continent: 'Afrika' },
  { name: 'Tanzania', capital: 'Dodoma', code: 'TZ', continent: 'Afrika' },
  { name: 'Togo', capital: 'Lomé', code: 'TG', continent: 'Afrika' },
  { name: 'Tunisia', capital: 'Tunis', code: 'TN', continent: 'Afrika' },
  { name: 'Uganda', capital: 'Kampala', code: 'UG', continent: 'Afrika' },
  { name: 'Zambia', capital: 'Lusaka', code: 'ZM', continent: 'Afrika' },
  { name: 'Zimbabwe', capital: 'Harare', code: 'ZW', continent: 'Afrika' },

  // ============================================
  // NORD-AMERIKA (23 land)
  // ============================================
  { name: 'Antigua og Barbuda', capital: 'Saint John\'s', code: 'AG', continent: 'Nord-Amerika' },
  { name: 'Bahamas', capital: 'Nassau', code: 'BS', continent: 'Nord-Amerika' },
  { name: 'Barbados', capital: 'Bridgetown', code: 'BB', continent: 'Nord-Amerika' },
  { name: 'Belize', capital: 'Belmopan', code: 'BZ', continent: 'Nord-Amerika' },
  { name: 'Canada', capital: 'Ottawa', code: 'CA', continent: 'Nord-Amerika' },
  { name: 'Costa Rica', capital: 'San José', code: 'CR', continent: 'Nord-Amerika' },
  { name: 'Cuba', capital: 'Havana', code: 'CU', continent: 'Nord-Amerika' },
  { name: 'Dominica', capital: 'Roseau', code: 'DM', continent: 'Nord-Amerika' },
  { name: 'Den dominikanske republikk', capital: 'Santo Domingo', code: 'DO', continent: 'Nord-Amerika' },
  { name: 'El Salvador', capital: 'San Salvador', code: 'SV', continent: 'Nord-Amerika' },
  { name: 'Grenada', capital: 'Saint George\'s', code: 'GD', continent: 'Nord-Amerika' },
  { name: 'Guatemala', capital: 'Guatemala by', code: 'GT', continent: 'Nord-Amerika' },
  { name: 'Haiti', capital: 'Port-au-Prince', code: 'HT', continent: 'Nord-Amerika' },
  { name: 'Honduras', capital: 'Tegucigalpa', code: 'HN', continent: 'Nord-Amerika' },
  { name: 'Jamaica', capital: 'Kingston', code: 'JM', continent: 'Nord-Amerika' },
  { name: 'Mexico', capital: 'Mexico by', code: 'MX', continent: 'Nord-Amerika' },
  { name: 'Nicaragua', capital: 'Managua', code: 'NI', continent: 'Nord-Amerika' },
  { name: 'Panama', capital: 'Panama by', code: 'PA', continent: 'Nord-Amerika' },
  { name: 'Saint Kitts og Nevis', capital: 'Basseterre', code: 'KN', continent: 'Nord-Amerika' },
  { name: 'Saint Lucia', capital: 'Castries', code: 'LC', continent: 'Nord-Amerika' },
  { name: 'Saint Vincent og Grenadinene', capital: 'Kingstown', code: 'VC', continent: 'Nord-Amerika' },
  { name: 'Trinidad og Tobago', capital: 'Port of Spain', code: 'TT', continent: 'Nord-Amerika' },
  { name: 'USA', capital: 'Washington D.C.', code: 'US', continent: 'Nord-Amerika' },

  // ============================================
  // SØR-AMERIKA (12 land)
  // ============================================
  { name: 'Argentina', capital: 'Buenos Aires', code: 'AR', continent: 'Sør-Amerika' },
  { name: 'Bolivia', capital: 'Sucre', code: 'BO', continent: 'Sør-Amerika' },
  { name: 'Brasil', capital: 'Brasília', code: 'BR', continent: 'Sør-Amerika' },
  { name: 'Chile', capital: 'Santiago', code: 'CL', continent: 'Sør-Amerika' },
  { name: 'Colombia', capital: 'Bogotá', code: 'CO', continent: 'Sør-Amerika' },
  { name: 'Ecuador', capital: 'Quito', code: 'EC', continent: 'Sør-Amerika' },
  { name: 'Guyana', capital: 'Georgetown', code: 'GY', continent: 'Sør-Amerika' },
  { name: 'Paraguay', capital: 'Asunción', code: 'PY', continent: 'Sør-Amerika' },
  { name: 'Peru', capital: 'Lima', code: 'PE', continent: 'Sør-Amerika' },
  { name: 'Surinam', capital: 'Paramaribo', code: 'SR', continent: 'Sør-Amerika' },
  { name: 'Uruguay', capital: 'Montevideo', code: 'UY', continent: 'Sør-Amerika' },
  { name: 'Venezuela', capital: 'Caracas', code: 'VE', continent: 'Sør-Amerika' },

  // ============================================
  // OSEANIA (14 land)
  // ============================================
  { name: 'Australia', capital: 'Canberra', code: 'AU', continent: 'Oseania' },
  { name: 'Fiji', capital: 'Suva', code: 'FJ', continent: 'Oseania' },
  { name: 'Kiribati', capital: 'Tarawa', code: 'KI', continent: 'Oseania' },
  { name: 'Marshalløyene', capital: 'Majuro', code: 'MH', continent: 'Oseania' },
  { name: 'Mikronesia', capital: 'Palikir', code: 'FM', continent: 'Oseania' },
  { name: 'Nauru', capital: 'Yaren', code: 'NR', continent: 'Oseania' },
  { name: 'New Zealand', capital: 'Wellington', code: 'NZ', continent: 'Oseania' },
  { name: 'Palau', capital: 'Ngerulmud', code: 'PW', continent: 'Oseania' },
  { name: 'Papua Ny-Guinea', capital: 'Port Moresby', code: 'PG', continent: 'Oseania' },
  { name: 'Samoa', capital: 'Apia', code: 'WS', continent: 'Oseania' },
  { name: 'Salomonøyene', capital: 'Honiara', code: 'SB', continent: 'Oseania' },
  { name: 'Tonga', capital: 'Nukualofa', code: 'TO', continent: 'Oseania' },
  { name: 'Tuvalu', capital: 'Funafuti', code: 'TV', continent: 'Oseania' },
  { name: 'Vanuatu', capital: 'Port Vila', code: 'VU', continent: 'Oseania' },
]

// Totalt: 46 + 48 + 54 + 23 + 12 + 14 = 197 land
// (Noen teller 193-198 avhengig av anerkjennelse)

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

export function getCountriesByContinent(continent: Continent): Country[] {
  return countries.filter(c => c.continent === continent)
}

export const continents: Continent[] = ['Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sør-Amerika', 'Oseania']
