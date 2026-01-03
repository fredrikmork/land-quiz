export type Continent = 'Europa' | 'Asia' | 'Afrika' | 'Nord-Amerika' | 'Sor-Amerika' | 'Oseania'

export interface Country {
  name: string
  capital: string
  flag: string
  code: string
  continent: Continent
}

export const countries: Country[] = [
  // ============================================
  // EUROPA (44 land)
  // ============================================
  { name: 'Albania', capital: 'Tirana', flag: '🇦🇱', code: 'AL', continent: 'Europa' },
  { name: 'Andorra', capital: 'Andorra la Vella', flag: '🇦🇩', code: 'AD', continent: 'Europa' },
  { name: 'Belgia', capital: 'Brussel', flag: '🇧🇪', code: 'BE', continent: 'Europa' },
  { name: 'Bosnia-Hercegovina', capital: 'Sarajevo', flag: '🇧🇦', code: 'BA', continent: 'Europa' },
  { name: 'Bulgaria', capital: 'Sofia', flag: '🇧🇬', code: 'BG', continent: 'Europa' },
  { name: 'Danmark', capital: 'København', flag: '🇩🇰', code: 'DK', continent: 'Europa' },
  { name: 'Estland', capital: 'Tallinn', flag: '🇪🇪', code: 'EE', continent: 'Europa' },
  { name: 'Finland', capital: 'Helsinki', flag: '🇫🇮', code: 'FI', continent: 'Europa' },
  { name: 'Frankrike', capital: 'Paris', flag: '🇫🇷', code: 'FR', continent: 'Europa' },
  { name: 'Hellas', capital: 'Athen', flag: '🇬🇷', code: 'GR', continent: 'Europa' },
  { name: 'Hviterussland', capital: 'Minsk', flag: '🇧🇾', code: 'BY', continent: 'Europa' },
  { name: 'Irland', capital: 'Dublin', flag: '🇮🇪', code: 'IE', continent: 'Europa' },
  { name: 'Island', capital: 'Reykjavik', flag: '🇮🇸', code: 'IS', continent: 'Europa' },
  { name: 'Italia', capital: 'Roma', flag: '🇮🇹', code: 'IT', continent: 'Europa' },
  { name: 'Kosovo', capital: 'Pristina', flag: '🇽🇰', code: 'XK', continent: 'Europa' },
  { name: 'Kroatia', capital: 'Zagreb', flag: '🇭🇷', code: 'HR', continent: 'Europa' },
  { name: 'Kypros', capital: 'Nikosia', flag: '🇨🇾', code: 'CY', continent: 'Europa' },
  { name: 'Latvia', capital: 'Riga', flag: '🇱🇻', code: 'LV', continent: 'Europa' },
  { name: 'Liechtenstein', capital: 'Vaduz', flag: '🇱🇮', code: 'LI', continent: 'Europa' },
  { name: 'Litauen', capital: 'Vilnius', flag: '🇱🇹', code: 'LT', continent: 'Europa' },
  { name: 'Luxembourg', capital: 'Luxembourg', flag: '🇱🇺', code: 'LU', continent: 'Europa' },
  { name: 'Malta', capital: 'Valletta', flag: '🇲🇹', code: 'MT', continent: 'Europa' },
  { name: 'Moldova', capital: 'Chisinau', flag: '🇲🇩', code: 'MD', continent: 'Europa' },
  { name: 'Monaco', capital: 'Monaco', flag: '🇲🇨', code: 'MC', continent: 'Europa' },
  { name: 'Montenegro', capital: 'Podgorica', flag: '🇲🇪', code: 'ME', continent: 'Europa' },
  { name: 'Nederland', capital: 'Amsterdam', flag: '🇳🇱', code: 'NL', continent: 'Europa' },
  { name: 'Nord-Makedonia', capital: 'Skopje', flag: '🇲🇰', code: 'MK', continent: 'Europa' },
  { name: 'Norge', capital: 'Oslo', flag: '🇳🇴', code: 'NO', continent: 'Europa' },
  { name: 'Polen', capital: 'Warszawa', flag: '🇵🇱', code: 'PL', continent: 'Europa' },
  { name: 'Portugal', capital: 'Lisboa', flag: '🇵🇹', code: 'PT', continent: 'Europa' },
  { name: 'Romania', capital: 'Bucuresti', flag: '🇷🇴', code: 'RO', continent: 'Europa' },
  { name: 'Russland', capital: 'Moskva', flag: '🇷🇺', code: 'RU', continent: 'Europa' },
  { name: 'San Marino', capital: 'San Marino', flag: '🇸🇲', code: 'SM', continent: 'Europa' },
  { name: 'Serbia', capital: 'Beograd', flag: '🇷🇸', code: 'RS', continent: 'Europa' },
  { name: 'Slovakia', capital: 'Bratislava', flag: '🇸🇰', code: 'SK', continent: 'Europa' },
  { name: 'Slovenia', capital: 'Ljubljana', flag: '🇸🇮', code: 'SI', continent: 'Europa' },
  { name: 'Spania', capital: 'Madrid', flag: '🇪🇸', code: 'ES', continent: 'Europa' },
  { name: 'Storbritannia', capital: 'London', flag: '🇬🇧', code: 'GB', continent: 'Europa' },
  { name: 'Sverige', capital: 'Stockholm', flag: '🇸🇪', code: 'SE', continent: 'Europa' },
  { name: 'Sveits', capital: 'Bern', flag: '🇨🇭', code: 'CH', continent: 'Europa' },
  { name: 'Tsjekkia', capital: 'Praha', flag: '🇨🇿', code: 'CZ', continent: 'Europa' },
  { name: 'Tyskland', capital: 'Berlin', flag: '🇩🇪', code: 'DE', continent: 'Europa' },
  { name: 'Ukraina', capital: 'Kyiv', flag: '🇺🇦', code: 'UA', continent: 'Europa' },
  { name: 'Ungarn', capital: 'Budapest', flag: '🇭🇺', code: 'HU', continent: 'Europa' },
  { name: 'Vatikanstaten', capital: 'Vatikanstaten', flag: '🇻🇦', code: 'VA', continent: 'Europa' },
  { name: 'Østerrike', capital: 'Wien', flag: '🇦🇹', code: 'AT', continent: 'Europa' },

  // ============================================
  // ASIA (49 land)
  // ============================================
  { name: 'Afghanistan', capital: 'Kabul', flag: '🇦🇫', code: 'AF', continent: 'Asia' },
  { name: 'Armenia', capital: 'Jerevan', flag: '🇦🇲', code: 'AM', continent: 'Asia' },
  { name: 'Aserbajdsjan', capital: 'Baku', flag: '🇦🇿', code: 'AZ', continent: 'Asia' },
  { name: 'Bahrain', capital: 'Manama', flag: '🇧🇭', code: 'BH', continent: 'Asia' },
  { name: 'Bangladesh', capital: 'Dhaka', flag: '🇧🇩', code: 'BD', continent: 'Asia' },
  { name: 'Bhutan', capital: 'Thimphu', flag: '🇧🇹', code: 'BT', continent: 'Asia' },
  { name: 'Brunei', capital: 'Bandar Seri Begawan', flag: '🇧🇳', code: 'BN', continent: 'Asia' },
  { name: 'Filippinene', capital: 'Manila', flag: '🇵🇭', code: 'PH', continent: 'Asia' },
  { name: 'De forente arabiske emirater', capital: 'Abu Dhabi', flag: '🇦🇪', code: 'AE', continent: 'Asia' },
  { name: 'Georgia', capital: 'Tbilisi', flag: '🇬🇪', code: 'GE', continent: 'Asia' },
  { name: 'India', capital: 'New Delhi', flag: '🇮🇳', code: 'IN', continent: 'Asia' },
  { name: 'Indonesia', capital: 'Jakarta', flag: '🇮🇩', code: 'ID', continent: 'Asia' },
  { name: 'Irak', capital: 'Bagdad', flag: '🇮🇶', code: 'IQ', continent: 'Asia' },
  { name: 'Iran', capital: 'Teheran', flag: '🇮🇷', code: 'IR', continent: 'Asia' },
  { name: 'Israel', capital: 'Jerusalem', flag: '🇮🇱', code: 'IL', continent: 'Asia' },
  { name: 'Japan', capital: 'Tokyo', flag: '🇯🇵', code: 'JP', continent: 'Asia' },
  { name: 'Jemen', capital: 'Sanaa', flag: '🇾🇪', code: 'YE', continent: 'Asia' },
  { name: 'Jordan', capital: 'Amman', flag: '🇯🇴', code: 'JO', continent: 'Asia' },
  { name: 'Kambodsja', capital: 'Phnom Penh', flag: '🇰🇭', code: 'KH', continent: 'Asia' },
  { name: 'Kasakhstan', capital: 'Astana', flag: '🇰🇿', code: 'KZ', continent: 'Asia' },
  { name: 'Kina', capital: 'Beijing', flag: '🇨🇳', code: 'CN', continent: 'Asia' },
  { name: 'Kirgisistan', capital: 'Bisjkek', flag: '🇰🇬', code: 'KG', continent: 'Asia' },
  { name: 'Kuwait', capital: 'Kuwait by', flag: '🇰🇼', code: 'KW', continent: 'Asia' },
  { name: 'Laos', capital: 'Vientiane', flag: '🇱🇦', code: 'LA', continent: 'Asia' },
  { name: 'Libanon', capital: 'Beirut', flag: '🇱🇧', code: 'LB', continent: 'Asia' },
  { name: 'Malaysia', capital: 'Kuala Lumpur', flag: '🇲🇾', code: 'MY', continent: 'Asia' },
  { name: 'Maldivene', capital: 'Malé', flag: '🇲🇻', code: 'MV', continent: 'Asia' },
  { name: 'Mongolia', capital: 'Ulaanbaatar', flag: '🇲🇳', code: 'MN', continent: 'Asia' },
  { name: 'Myanmar', capital: 'Naypyidaw', flag: '🇲🇲', code: 'MM', continent: 'Asia' },
  { name: 'Nepal', capital: 'Katmandu', flag: '🇳🇵', code: 'NP', continent: 'Asia' },
  { name: 'Nord-Korea', capital: 'Pyongyang', flag: '🇰🇵', code: 'KP', continent: 'Asia' },
  { name: 'Oman', capital: 'Muskat', flag: '🇴🇲', code: 'OM', continent: 'Asia' },
  { name: 'Pakistan', capital: 'Islamabad', flag: '🇵🇰', code: 'PK', continent: 'Asia' },
  { name: 'Palestina', capital: 'Ramallah', flag: '🇵🇸', code: 'PS', continent: 'Asia' },
  { name: 'Qatar', capital: 'Doha', flag: '🇶🇦', code: 'QA', continent: 'Asia' },
  { name: 'Saudi-Arabia', capital: 'Riyadh', flag: '🇸🇦', code: 'SA', continent: 'Asia' },
  { name: 'Singapore', capital: 'Singapore', flag: '🇸🇬', code: 'SG', continent: 'Asia' },
  { name: 'Sri Lanka', capital: 'Colombo', flag: '🇱🇰', code: 'LK', continent: 'Asia' },
  { name: 'Syria', capital: 'Damaskus', flag: '🇸🇾', code: 'SY', continent: 'Asia' },
  { name: 'Sør-Korea', capital: 'Seoul', flag: '🇰🇷', code: 'KR', continent: 'Asia' },
  { name: 'Tadsjikistan', capital: 'Dusjanbe', flag: '🇹🇯', code: 'TJ', continent: 'Asia' },
  { name: 'Taiwan', capital: 'Taipei', flag: '🇹🇼', code: 'TW', continent: 'Asia' },
  { name: 'Thailand', capital: 'Bangkok', flag: '🇹🇭', code: 'TH', continent: 'Asia' },
  { name: 'Timor-Leste', capital: 'Dili', flag: '🇹🇱', code: 'TL', continent: 'Asia' },
  { name: 'Turkmenistan', capital: 'Asjkhabad', flag: '🇹🇲', code: 'TM', continent: 'Asia' },
  { name: 'Tyrkia', capital: 'Ankara', flag: '🇹🇷', code: 'TR', continent: 'Asia' },
  { name: 'Usbekistan', capital: 'Tasjkent', flag: '🇺🇿', code: 'UZ', continent: 'Asia' },
  { name: 'Vietnam', capital: 'Hanoi', flag: '🇻🇳', code: 'VN', continent: 'Asia' },

  // ============================================
  // AFRIKA (54 land)
  // ============================================
  { name: 'Algeria', capital: 'Alger', flag: '🇩🇿', code: 'DZ', continent: 'Afrika' },
  { name: 'Angola', capital: 'Luanda', flag: '🇦🇴', code: 'AO', continent: 'Afrika' },
  { name: 'Benin', capital: 'Porto-Novo', flag: '🇧🇯', code: 'BJ', continent: 'Afrika' },
  { name: 'Botswana', capital: 'Gaborone', flag: '🇧🇼', code: 'BW', continent: 'Afrika' },
  { name: 'Burkina Faso', capital: 'Ouagadougou', flag: '🇧🇫', code: 'BF', continent: 'Afrika' },
  { name: 'Burundi', capital: 'Gitega', flag: '🇧🇮', code: 'BI', continent: 'Afrika' },
  { name: 'Kamerun', capital: 'Yaoundé', flag: '🇨🇲', code: 'CM', continent: 'Afrika' },
  { name: 'Kapp Verde', capital: 'Praia', flag: '🇨🇻', code: 'CV', continent: 'Afrika' },
  { name: 'Den sentralafrikanske republikk', capital: 'Bangui', flag: '🇨🇫', code: 'CF', continent: 'Afrika' },
  { name: 'Tsjad', capital: "N'Djamena", flag: '🇹🇩', code: 'TD', continent: 'Afrika' },
  { name: 'Komorene', capital: 'Moroni', flag: '🇰🇲', code: 'KM', continent: 'Afrika' },
  { name: 'Kongo-Brazzaville', capital: 'Brazzaville', flag: '🇨🇬', code: 'CG', continent: 'Afrika' },
  { name: 'Kongo-Kinshasa', capital: 'Kinshasa', flag: '🇨🇩', code: 'CD', continent: 'Afrika' },
  { name: 'Elfenbenskysten', capital: 'Yamoussoukro', flag: '🇨🇮', code: 'CI', continent: 'Afrika' },
  { name: 'Djibouti', capital: 'Djibouti', flag: '🇩🇯', code: 'DJ', continent: 'Afrika' },
  { name: 'Egypt', capital: 'Kairo', flag: '🇪🇬', code: 'EG', continent: 'Afrika' },
  { name: 'Ekvatorial-Guinea', capital: 'Malabo', flag: '🇬🇶', code: 'GQ', continent: 'Afrika' },
  { name: 'Eritrea', capital: 'Asmara', flag: '🇪🇷', code: 'ER', continent: 'Afrika' },
  { name: 'Eswatini', capital: 'Mbabane', flag: '🇸🇿', code: 'SZ', continent: 'Afrika' },
  { name: 'Etiopia', capital: 'Addis Abeba', flag: '🇪🇹', code: 'ET', continent: 'Afrika' },
  { name: 'Gabon', capital: 'Libreville', flag: '🇬🇦', code: 'GA', continent: 'Afrika' },
  { name: 'Gambia', capital: 'Banjul', flag: '🇬🇲', code: 'GM', continent: 'Afrika' },
  { name: 'Ghana', capital: 'Accra', flag: '🇬🇭', code: 'GH', continent: 'Afrika' },
  { name: 'Guinea', capital: 'Conakry', flag: '🇬🇳', code: 'GN', continent: 'Afrika' },
  { name: 'Guinea-Bissau', capital: 'Bissau', flag: '🇬🇼', code: 'GW', continent: 'Afrika' },
  { name: 'Kenya', capital: 'Nairobi', flag: '🇰🇪', code: 'KE', continent: 'Afrika' },
  { name: 'Lesotho', capital: 'Maseru', flag: '🇱🇸', code: 'LS', continent: 'Afrika' },
  { name: 'Liberia', capital: 'Monrovia', flag: '🇱🇷', code: 'LR', continent: 'Afrika' },
  { name: 'Libya', capital: 'Tripoli', flag: '🇱🇾', code: 'LY', continent: 'Afrika' },
  { name: 'Madagaskar', capital: 'Antananarivo', flag: '🇲🇬', code: 'MG', continent: 'Afrika' },
  { name: 'Malawi', capital: 'Lilongwe', flag: '🇲🇼', code: 'MW', continent: 'Afrika' },
  { name: 'Mali', capital: 'Bamako', flag: '🇲🇱', code: 'ML', continent: 'Afrika' },
  { name: 'Mauritania', capital: 'Nouakchott', flag: '🇲🇷', code: 'MR', continent: 'Afrika' },
  { name: 'Mauritius', capital: 'Port Louis', flag: '🇲🇺', code: 'MU', continent: 'Afrika' },
  { name: 'Marokko', capital: 'Rabat', flag: '🇲🇦', code: 'MA', continent: 'Afrika' },
  { name: 'Mosambik', capital: 'Maputo', flag: '🇲🇿', code: 'MZ', continent: 'Afrika' },
  { name: 'Namibia', capital: 'Windhoek', flag: '🇳🇦', code: 'NA', continent: 'Afrika' },
  { name: 'Niger', capital: 'Niamey', flag: '🇳🇪', code: 'NE', continent: 'Afrika' },
  { name: 'Nigeria', capital: 'Abuja', flag: '🇳🇬', code: 'NG', continent: 'Afrika' },
  { name: 'Rwanda', capital: 'Kigali', flag: '🇷🇼', code: 'RW', continent: 'Afrika' },
  { name: 'São Tomé og Príncipe', capital: 'São Tomé', flag: '🇸🇹', code: 'ST', continent: 'Afrika' },
  { name: 'Senegal', capital: 'Dakar', flag: '🇸🇳', code: 'SN', continent: 'Afrika' },
  { name: 'Seychellene', capital: 'Victoria', flag: '🇸🇨', code: 'SC', continent: 'Afrika' },
  { name: 'Sierra Leone', capital: 'Freetown', flag: '🇸🇱', code: 'SL', continent: 'Afrika' },
  { name: 'Somalia', capital: 'Mogadishu', flag: '🇸🇴', code: 'SO', continent: 'Afrika' },
  { name: 'Sør-Afrika', capital: 'Pretoria', flag: '🇿🇦', code: 'ZA', continent: 'Afrika' },
  { name: 'Sør-Sudan', capital: 'Juba', flag: '🇸🇸', code: 'SS', continent: 'Afrika' },
  { name: 'Sudan', capital: 'Khartoum', flag: '🇸🇩', code: 'SD', continent: 'Afrika' },
  { name: 'Tanzania', capital: 'Dodoma', flag: '🇹🇿', code: 'TZ', continent: 'Afrika' },
  { name: 'Togo', capital: 'Lomé', flag: '🇹🇬', code: 'TG', continent: 'Afrika' },
  { name: 'Tunisia', capital: 'Tunis', flag: '🇹🇳', code: 'TN', continent: 'Afrika' },
  { name: 'Uganda', capital: 'Kampala', flag: '🇺🇬', code: 'UG', continent: 'Afrika' },
  { name: 'Zambia', capital: 'Lusaka', flag: '🇿🇲', code: 'ZM', continent: 'Afrika' },
  { name: 'Zimbabwe', capital: 'Harare', flag: '🇿🇼', code: 'ZW', continent: 'Afrika' },

  // ============================================
  // NORD-AMERIKA (23 land)
  // ============================================
  { name: 'Antigua og Barbuda', capital: 'Saint John\'s', flag: '🇦🇬', code: 'AG', continent: 'Nord-Amerika' },
  { name: 'Bahamas', capital: 'Nassau', flag: '🇧🇸', code: 'BS', continent: 'Nord-Amerika' },
  { name: 'Barbados', capital: 'Bridgetown', flag: '🇧🇧', code: 'BB', continent: 'Nord-Amerika' },
  { name: 'Belize', capital: 'Belmopan', flag: '🇧🇿', code: 'BZ', continent: 'Nord-Amerika' },
  { name: 'Canada', capital: 'Ottawa', flag: '🇨🇦', code: 'CA', continent: 'Nord-Amerika' },
  { name: 'Costa Rica', capital: 'San José', flag: '🇨🇷', code: 'CR', continent: 'Nord-Amerika' },
  { name: 'Cuba', capital: 'Havana', flag: '🇨🇺', code: 'CU', continent: 'Nord-Amerika' },
  { name: 'Dominica', capital: 'Roseau', flag: '🇩🇲', code: 'DM', continent: 'Nord-Amerika' },
  { name: 'Den dominikanske republikk', capital: 'Santo Domingo', flag: '🇩🇴', code: 'DO', continent: 'Nord-Amerika' },
  { name: 'El Salvador', capital: 'San Salvador', flag: '🇸🇻', code: 'SV', continent: 'Nord-Amerika' },
  { name: 'Grenada', capital: 'Saint George\'s', flag: '🇬🇩', code: 'GD', continent: 'Nord-Amerika' },
  { name: 'Guatemala', capital: 'Guatemala by', flag: '🇬🇹', code: 'GT', continent: 'Nord-Amerika' },
  { name: 'Haiti', capital: 'Port-au-Prince', flag: '🇭🇹', code: 'HT', continent: 'Nord-Amerika' },
  { name: 'Honduras', capital: 'Tegucigalpa', flag: '🇭🇳', code: 'HN', continent: 'Nord-Amerika' },
  { name: 'Jamaica', capital: 'Kingston', flag: '🇯🇲', code: 'JM', continent: 'Nord-Amerika' },
  { name: 'Mexico', capital: 'Mexico by', flag: '🇲🇽', code: 'MX', continent: 'Nord-Amerika' },
  { name: 'Nicaragua', capital: 'Managua', flag: '🇳🇮', code: 'NI', continent: 'Nord-Amerika' },
  { name: 'Panama', capital: 'Panama by', flag: '🇵🇦', code: 'PA', continent: 'Nord-Amerika' },
  { name: 'Saint Kitts og Nevis', capital: 'Basseterre', flag: '🇰🇳', code: 'KN', continent: 'Nord-Amerika' },
  { name: 'Saint Lucia', capital: 'Castries', flag: '🇱🇨', code: 'LC', continent: 'Nord-Amerika' },
  { name: 'Saint Vincent og Grenadinene', capital: 'Kingstown', flag: '🇻🇨', code: 'VC', continent: 'Nord-Amerika' },
  { name: 'Trinidad og Tobago', capital: 'Port of Spain', flag: '🇹🇹', code: 'TT', continent: 'Nord-Amerika' },
  { name: 'USA', capital: 'Washington D.C.', flag: '🇺🇸', code: 'US', continent: 'Nord-Amerika' },

  // ============================================
  // SØR-AMERIKA (12 land)
  // ============================================
  { name: 'Argentina', capital: 'Buenos Aires', flag: '🇦🇷', code: 'AR', continent: 'Sor-Amerika' },
  { name: 'Bolivia', capital: 'Sucre', flag: '🇧🇴', code: 'BO', continent: 'Sor-Amerika' },
  { name: 'Brasil', capital: 'Brasília', flag: '🇧🇷', code: 'BR', continent: 'Sor-Amerika' },
  { name: 'Chile', capital: 'Santiago', flag: '🇨🇱', code: 'CL', continent: 'Sor-Amerika' },
  { name: 'Colombia', capital: 'Bogotá', flag: '🇨🇴', code: 'CO', continent: 'Sor-Amerika' },
  { name: 'Ecuador', capital: 'Quito', flag: '🇪🇨', code: 'EC', continent: 'Sor-Amerika' },
  { name: 'Guyana', capital: 'Georgetown', flag: '🇬🇾', code: 'GY', continent: 'Sor-Amerika' },
  { name: 'Paraguay', capital: 'Asunción', flag: '🇵🇾', code: 'PY', continent: 'Sor-Amerika' },
  { name: 'Peru', capital: 'Lima', flag: '🇵🇪', code: 'PE', continent: 'Sor-Amerika' },
  { name: 'Surinam', capital: 'Paramaribo', flag: '🇸🇷', code: 'SR', continent: 'Sor-Amerika' },
  { name: 'Uruguay', capital: 'Montevideo', flag: '🇺🇾', code: 'UY', continent: 'Sor-Amerika' },
  { name: 'Venezuela', capital: 'Caracas', flag: '🇻🇪', code: 'VE', continent: 'Sor-Amerika' },

  // ============================================
  // OSEANIA (14 land)
  // ============================================
  { name: 'Australia', capital: 'Canberra', flag: '🇦🇺', code: 'AU', continent: 'Oseania' },
  { name: 'Fiji', capital: 'Suva', flag: '🇫🇯', code: 'FJ', continent: 'Oseania' },
  { name: 'Kiribati', capital: 'Tarawa', flag: '🇰🇮', code: 'KI', continent: 'Oseania' },
  { name: 'Marshalløyene', capital: 'Majuro', flag: '🇲🇭', code: 'MH', continent: 'Oseania' },
  { name: 'Mikronesia', capital: 'Palikir', flag: '🇫🇲', code: 'FM', continent: 'Oseania' },
  { name: 'Nauru', capital: 'Yaren', flag: '🇳🇷', code: 'NR', continent: 'Oseania' },
  { name: 'New Zealand', capital: 'Wellington', flag: '🇳🇿', code: 'NZ', continent: 'Oseania' },
  { name: 'Palau', capital: 'Ngerulmud', flag: '🇵🇼', code: 'PW', continent: 'Oseania' },
  { name: 'Papua Ny-Guinea', capital: 'Port Moresby', flag: '🇵🇬', code: 'PG', continent: 'Oseania' },
  { name: 'Samoa', capital: 'Apia', flag: '🇼🇸', code: 'WS', continent: 'Oseania' },
  { name: 'Salomonøyene', capital: 'Honiara', flag: '🇸🇧', code: 'SB', continent: 'Oseania' },
  { name: 'Tonga', capital: 'Nukualofa', flag: '🇹🇴', code: 'TO', continent: 'Oseania' },
  { name: 'Tuvalu', capital: 'Funafuti', flag: '🇹🇻', code: 'TV', continent: 'Oseania' },
  { name: 'Vanuatu', capital: 'Port Vila', flag: '🇻🇺', code: 'VU', continent: 'Oseania' },
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

export const continents: Continent[] = ['Europa', 'Asia', 'Afrika', 'Nord-Amerika', 'Sor-Amerika', 'Oseania']
