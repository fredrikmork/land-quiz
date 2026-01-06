export type Continent = 'Europa' | 'Asia' | 'Afrika' | 'Nord-Amerika' | 'Sør-Amerika' | 'Oseania'

export interface Country {
  name: string
  capital: string
  code: string
  continent: Continent
  capitalCoordinates?: [number, number] // [longitude, latitude]
  population?: number
  area?: number // km²
  government?: string
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
  { name: 'Albania', capital: 'Tirana', code: 'AL', continent: 'Europa', capitalCoordinates: [19.49, 41.19], population: 2363314, area: 28748, government: 'Parlamentarisk republikk' },
  { name: 'Andorra', capital: 'Andorra la Vella', code: 'AD', continent: 'Europa', capitalCoordinates: [1.31, 42.3], population: 88406, area: 468, government: 'Parlamentarisk ko-fyrstedømme' },
  { name: 'Belgia', capital: 'Brussel', code: 'BE', continent: 'Europa', capitalCoordinates: [4.2, 50.5], population: 11825551, area: 30528, government: 'Konstitusjonelt monarki' },
  { name: 'Bosnia-Hercegovina', capital: 'Sarajevo', code: 'BA', continent: 'Europa', capitalCoordinates: [18.25, 43.52], population: 3422000, area: 51209, government: 'Parlamentarisk republikk' },
  { name: 'Bulgaria', capital: 'Sofia', code: 'BG', continent: 'Europa', capitalCoordinates: [23.19, 42.41], population: 6437360, area: 110879, government: 'Parlamentarisk republikk' },
  { name: 'Danmark', capital: 'København', code: 'DK', continent: 'Europa', capitalCoordinates: [12.35, 55.4], population: 6011488, area: 43094, government: 'Konstitusjonelt monarki' },
  { name: 'Estland', capital: 'Tallinn', code: 'EE', continent: 'Europa', capitalCoordinates: [24.43, 59.26], population: 1369995, area: 45227, government: 'Parlamentarisk republikk' },
  { name: 'Finland', capital: 'Helsinki', code: 'FI', continent: 'Europa', capitalCoordinates: [24.56, 60.1], population: 5650325, area: 338455, government: 'Parlamentarisk republikk' },
  { name: 'Frankrike', capital: 'Paris', code: 'FR', continent: 'Europa', capitalCoordinates: [2.2, 48.52], population: 66351959, area: 543908, government: 'Semi-presidentielt republikk' },
  { name: 'Hellas', capital: 'Athen', code: 'GR', continent: 'Europa', capitalCoordinates: [23.44, 37.59], population: 10400720, area: 131990, government: 'Parlamentarisk republikk' },
  { name: 'Belarus', capital: 'Minsk', code: 'BY', continent: 'Europa', capitalCoordinates: [27.34, 53.54], population: 9109280, area: 207600, government: 'Presidentielt republikk' },
  { name: 'Irland', capital: 'Dublin', code: 'IE', continent: 'Europa', capitalCoordinates: [-6.14, 53.19], population: 5458600, area: 70273, government: 'Parlamentarisk republikk' },
  { name: 'Island', capital: 'Reykjavik', code: 'IS', continent: 'Europa', capitalCoordinates: [-21.57, 64.09], population: 391810, area: 103000, government: 'Parlamentarisk republikk' },
  { name: 'Italia', capital: 'Roma', code: 'IT', continent: 'Europa', capitalCoordinates: [12.29, 41.54], population: 58927633, area: 301336, government: 'Parlamentarisk republikk' },
  { name: 'Kosovo', capital: 'Pristina', code: 'XK', continent: 'Europa', capitalCoordinates: [21.17, 42.67], population: 1585566, area: 10908, government: 'Parlamentarisk republikk' },
  { name: 'Kroatia', capital: 'Zagreb', code: 'HR', continent: 'Europa', capitalCoordinates: [16, 45.48], population: 3866233, area: 56594, government: 'Parlamentarisk republikk' },
  { name: 'Kypros', capital: 'Nikosia', code: 'CY', continent: 'Europa', capitalCoordinates: [33.22, 35.1], population: 1442614, area: 9251, government: 'Presidentielt republikk' },
  { name: 'Latvia', capital: 'Riga', code: 'LV', continent: 'Europa', capitalCoordinates: [24.06, 56.57], population: 1829000, area: 64559, government: 'Parlamentarisk republikk' },
  { name: 'Liechtenstein', capital: 'Vaduz', code: 'LI', continent: 'Europa', capitalCoordinates: [9.31, 47.08], population: 40900, area: 160, government: 'Konstitusjonelt monarki' },
  { name: 'Litauen', capital: 'Vilnius', code: 'LT', continent: 'Europa', capitalCoordinates: [25.19, 54.41], population: 2894886, area: 65300, government: 'Semi-presidentielt republikk' },
  { name: 'Luxembourg', capital: 'Luxembourg', code: 'LU', continent: 'Europa', capitalCoordinates: [6.07, 49.36], population: 681973, area: 2586, government: 'Konstitusjonelt monarki' },
  { name: 'Malta', capital: 'Valletta', code: 'MT', continent: 'Europa', capitalCoordinates: [14.3, 35.53], population: 574250, area: 316, government: 'Parlamentarisk republikk' },
  { name: 'Moldova', capital: 'Chisinau', code: 'MD', continent: 'Europa', capitalCoordinates: [28.51, 47], population: 2749076, area: 33847, government: 'Parlamentarisk republikk' },
  { name: 'Monaco', capital: 'Monaco', code: 'MC', continent: 'Europa', capitalCoordinates: [7.25, 43.44], population: 38423, area: 2.02, government: 'Konstitusjonelt monarki' },
  { name: 'Montenegro', capital: 'Podgorica', code: 'ME', continent: 'Europa', capitalCoordinates: [19.16, 42.26], population: 623327, area: 13812, government: 'Parlamentarisk republikk' },
  { name: 'Nederland', capital: 'Amsterdam', code: 'NL', continent: 'Europa', capitalCoordinates: [4.54, 52.23], population: 18100436, area: 41865, government: 'Konstitusjonelt monarki' },
  { name: 'Nord-Makedonia', capital: 'Skopje', code: 'MK', continent: 'Europa', capitalCoordinates: [21.26, 42], population: 1822612, area: 25713, government: 'Parlamentarisk republikk' },
  { name: 'Norge', capital: 'Oslo', code: 'NO', continent: 'Europa', capitalCoordinates: [10.45, 59.55], population: 5606944, area: 386224, government: 'Konstitusjonelt monarki' },
  { name: 'Polen', capital: 'Warszawa', code: 'PL', continent: 'Europa', capitalCoordinates: [21, 52.15], population: 37392000, area: 312679, government: 'Semi-presidentielt republikk' },
  { name: 'Portugal', capital: 'Lisboa', code: 'PT', continent: 'Europa', capitalCoordinates: [-9.08, 38.43], population: 10749635, area: 92090, government: 'Semi-presidentielt republikk' },
  { name: 'Romania', capital: 'Bucuresti', code: 'RO', continent: 'Europa', capitalCoordinates: [26.06, 44.26], population: 19036031, area: 238391, government: 'Semi-presidentielt republikk' },
  { name: 'Russland', capital: 'Moskva', code: 'RU', continent: 'Europa', capitalCoordinates: [37.35, 55.45], population: 146028325, area: 17098246, government: 'Semi-presidentielt republikk' },
  { name: 'San Marino', capital: 'San Marino', code: 'SM', continent: 'Europa', capitalCoordinates: [12.25, 43.56], population: 34132, area: 61, government: 'Parlamentarisk republikk' },
  { name: 'Serbia', capital: 'Beograd', code: 'RS', continent: 'Europa', capitalCoordinates: [20.3, 44.5], population: 6567783, area: 77589, government: 'Parlamentarisk republikk' },
  { name: 'Slovakia', capital: 'Bratislava', code: 'SK', continent: 'Europa', capitalCoordinates: [17.07, 48.09], population: 5413813, area: 49037, government: 'Parlamentarisk republikk' },
  { name: 'Slovenia', capital: 'Ljubljana', code: 'SI', continent: 'Europa', capitalCoordinates: [14.31, 46.03], population: 2130638, area: 20273, government: 'Parlamentarisk republikk' },
  { name: 'Spania', capital: 'Madrid', code: 'ES', continent: 'Europa', capitalCoordinates: [-3.41, 40.24], population: 49315949, area: 505992, government: 'Konstitusjonelt monarki' },
  { name: 'Storbritannia', capital: 'London', code: 'GB', continent: 'Europa', capitalCoordinates: [-0.1, 51.3], population: 69281437, area: 244376, government: 'Konstitusjonelt monarki' },
  { name: 'Sverige', capital: 'Stockholm', code: 'SE', continent: 'Europa', capitalCoordinates: [18.03, 59.2], population: 10605098, area: 450295, government: 'Konstitusjonelt monarki' },
  { name: 'Sveits', capital: 'Bern', code: 'CH', continent: 'Europa', capitalCoordinates: [7.26, 46.57], population: 9082848, area: 41284, government: 'Føderal republikk' },
  { name: 'Tsjekkia', capital: 'Praha', code: 'CZ', continent: 'Europa', capitalCoordinates: [14.28, 50.05], population: 10882341, area: 78865, government: 'Parlamentarisk republikk' },
  { name: 'Tyskland', capital: 'Berlin', code: 'DE', continent: 'Europa', capitalCoordinates: [13.24, 52.31], population: 83491249, area: 357114, government: 'Føderal parlamentarisk republikk' },
  { name: 'Ukraina', capital: 'Kyiv', code: 'UA', continent: 'Europa', capitalCoordinates: [30.554, 50.441], population: 32862000, area: 603550, government: 'Semi-presidentielt republikk' },
  { name: 'Ungarn', capital: 'Budapest', code: 'HU', continent: 'Europa', capitalCoordinates: [19.05, 47.3], population: 9539502, area: 93028, government: 'Parlamentarisk republikk' },
  { name: 'Vatikanstaten', capital: 'Vatikanstaten', code: 'VA', continent: 'Europa', capitalCoordinates: [12.27, 41.54], population: 882, area: 0.49, government: 'Absolutt monarkiteokrati' },
  { name: 'Østerrike', capital: 'Wien', code: 'AT', continent: 'Europa', capitalCoordinates: [16.22, 48.12], population: 9200931, area: 83871, government: 'Føderal parlamentarisk republikk' },

  // ============================================
  // ASIA (49 land)
  // ============================================
  { name: 'Afghanistan', capital: 'Kabul', code: 'AF', continent: 'Asia', capitalCoordinates: [69.11, 34.31], population: 43844000, area: 652230, government: 'Islamsk emirat' },
  { name: 'Armenia', capital: 'Jerevan', code: 'AM', continent: 'Asia', capitalCoordinates: [44.3, 40.1], population: 3076200, area: 29743, government: 'Parlamentarisk republikk' },
  { name: 'Aserbajdsjan', capital: 'Baku', code: 'AZ', continent: 'Asia', capitalCoordinates: [49.52, 40.23], population: 10241722, area: 86600, government: 'Presidentielt republikk' },
  { name: 'Bahrain', capital: 'Manama', code: 'BH', continent: 'Asia', capitalCoordinates: [50.34, 26.14], population: 1594654, area: 765, government: 'Absolutt monarki' },
  { name: 'Bangladesh', capital: 'Dhaka', code: 'BD', continent: 'Asia', capitalCoordinates: [90.24, 23.43], population: 169828911, area: 147570, government: 'Parlamentarisk republikk' },
  { name: 'Bhutan', capital: 'Thimphu', code: 'BT', continent: 'Asia', capitalCoordinates: [89.36, 27.29], population: 784043, area: 38394, government: 'Konstitusjonelt monarki' },
  { name: 'Brunei', capital: 'Bandar Seri Begawan', code: 'BN', continent: 'Asia', capitalCoordinates: [114.56, 4.53], population: 455500, area: 5765, government: 'Absolutt monarki' },
  { name: 'Filippinene', capital: 'Manila', code: 'PH', continent: 'Asia', capitalCoordinates: [121, 14.35], population: 114123600, area: 342353, government: 'Presidentielt republikk' },
  { name: 'De forente arabiske emirater', capital: 'Abu Dhabi', code: 'AE', continent: 'Asia', capitalCoordinates: [54.22, 24.28], population: 11294243, area: 83600, government: 'Føderal absolutt monarki' },
  { name: 'Georgia', capital: 'Tbilisi', code: 'GE', continent: 'Asia', capitalCoordinates: [44.47, 41.43], population: 4000921, area: 69700, government: 'Parlamentarisk republikk' },
  { name: 'India', capital: 'New Delhi', code: 'IN', continent: 'Asia', capitalCoordinates: [77.12, 28.36], population: 1417492000, area: 3287263, government: 'Føderal parlamentarisk republikk' },
  { name: 'Indonesia', capital: 'Jakarta', code: 'ID', continent: 'Asia', capitalCoordinates: [106.49, -6.1], population: 284438782, area: 1904569, government: 'Presidentielt republikk' },
  { name: 'Irak', capital: 'Bagdad', code: 'IQ', continent: 'Asia', capitalCoordinates: [44.23, 33.2], population: 46118793, area: 438317, government: 'Parlamentarisk republikk' },
  { name: 'Iran', capital: 'Teheran', code: 'IR', continent: 'Asia', capitalCoordinates: [51.25, 35.4], population: 85961000, area: 1648195, government: 'Islamsk teokratisk republikk' },
  { name: 'Israel', capital: 'Jerusalem', code: 'IL', continent: 'Asia', capitalCoordinates: [35.14, 31.46], population: 10134800, area: 21937, government: 'Parlamentarisk republikk' },
  { name: 'Japan', capital: 'Tokyo', code: 'JP', continent: 'Asia', capitalCoordinates: [139.45, 35.41], population: 123210000, area: 377930, government: 'Konstitusjonelt monarki' },
  { name: 'Jemen', capital: 'Sanaa', code: 'YE', continent: 'Asia', capitalCoordinates: [44.12, 15.21], population: 32684503, area: 527968, government: 'Presidentielt republikk' },
  { name: 'Jordan', capital: 'Amman', code: 'JO', continent: 'Asia', capitalCoordinates: [35.56, 31.57], population: 11734000, area: 89342, government: 'Konstitusjonelt monarki' },
  { name: 'Kambodsja', capital: 'Phnom Penh', code: 'KH', continent: 'Asia', capitalCoordinates: [104.55, 11.33], population: 17577760, area: 181035, government: 'Konstitusjonelt monarki' },
  { name: 'Kasakhstan', capital: 'Astana', code: 'KZ', continent: 'Asia', capitalCoordinates: [71.25, 51.1], population: 20426568, area: 2724900, government: 'Presidentielt republikk' },
  { name: 'Kina', capital: 'Beijing', code: 'CN', continent: 'Asia', capitalCoordinates: [116.23, 39.55], population: 1408280000, area: 9706961, government: 'Kommunistisk ettpartistyre' },
  { name: 'Kirgisistan', capital: 'Bisjkek', code: 'KG', continent: 'Asia', capitalCoordinates: [74.36, 42.52], population: 7281800, area: 199951, government: 'Presidentielt republikk' },
  { name: 'Kuwait', capital: 'Kuwait by', code: 'KW', continent: 'Asia', capitalCoordinates: [47.58, 29.22], population: 4881254, area: 17818, government: 'Konstitusjonelt monarki' },
  { name: 'Laos', capital: 'Vientiane', code: 'LA', continent: 'Asia', capitalCoordinates: [102.36, 17.58], population: 7647000, area: 236800, government: 'Kommunistisk ettpartistyre' },
  { name: 'Libanon', capital: 'Beirut', code: 'LB', continent: 'Asia', capitalCoordinates: [35.3, 33.52], population: 5490000, area: 10452, government: 'Parlamentarisk republikk' },
  { name: 'Malaysia', capital: 'Kuala Lumpur', code: 'MY', continent: 'Asia', capitalCoordinates: [101.42, 3.1], population: 34231700, area: 330803, government: 'Konstitusjonelt monarki' },
  { name: 'Maldivene', capital: 'Malé', code: 'MV', continent: 'Asia', capitalCoordinates: [73.3, 4.1], population: 515132, area: 300, government: 'Presidentielt republikk' },
  { name: 'Mongolia', capital: 'Ulaanbaatar', code: 'MN', continent: 'Asia', capitalCoordinates: [106.55, 47.55], population: 3544835, area: 1564110, government: 'Semi-presidentielt republikk' },
  { name: 'Myanmar', capital: 'Naypyidaw', code: 'MM', continent: 'Asia', capitalCoordinates: [96.09, 16.48], population: 51316756, area: 676578, government: 'Militærjunta' },
  { name: 'Nepal', capital: 'Katmandu', code: 'NP', continent: 'Asia', capitalCoordinates: [85.19, 27.43], population: 29911840, area: 147181, government: 'Parlamentarisk republikk' },
  { name: 'Nord-Korea', capital: 'Pyongyang', code: 'KP', continent: 'Asia', capitalCoordinates: [125.45, 39.01], population: 25950000, area: 120538, government: 'Kommunistisk ettpartistyre' },
  { name: 'Oman', capital: 'Muskat', code: 'OM', continent: 'Asia', capitalCoordinates: [58.35, 23.37], population: 5343630, area: 309500, government: 'Absolutt monarki' },
  { name: 'Pakistan', capital: 'Islamabad', code: 'PK', continent: 'Asia', capitalCoordinates: [73.1, 33.42], population: 241499431, area: 796095, government: 'Parlamentarisk føderal republikk' },
  { name: 'Palestina', capital: 'Ramallah', code: 'PS', continent: 'Asia', capitalCoordinates: [34.2, 31.25], population: 5483450, area: 6220, government: 'Semi-presidentielt republikk' },
  { name: 'Qatar', capital: 'Doha', code: 'QA', continent: 'Asia', capitalCoordinates: [51.32, 25.17], population: 3173024, area: 11586, government: 'Absolutt monarki' },
  { name: 'Saudi-Arabia', capital: 'Riyadh', code: 'SA', continent: 'Asia', capitalCoordinates: [46.43, 24.38], population: 35300280, area: 2149690, government: 'Absolutt monarki' },
  { name: 'Singapore', capital: 'Singapore', code: 'SG', continent: 'Asia', capitalCoordinates: [103.51, 1.17], population: 6110200, area: 710, government: 'Parlamentarisk republikk' },
  { name: 'Sri Lanka', capital: 'Colombo', code: 'LK', continent: 'Asia', capitalCoordinates: [79.51, 6.56], population: 21763170, area: 65610, government: 'Semi-presidentielt republikk' },
  { name: 'Syria', capital: 'Damaskus', code: 'SY', continent: 'Asia', capitalCoordinates: [36.18, 33.3], population: 25620000, area: 185180, government: 'Presidentielt republikk' },
  { name: 'Sør-Korea', capital: 'Seoul', code: 'KR', continent: 'Asia', capitalCoordinates: [126.59, 37.33], population: 51159889, area: 100210, government: 'Presidentielt republikk' },
  { name: 'Tadsjikistan', capital: 'Dusjanbe', code: 'TJ', continent: 'Asia', capitalCoordinates: [68.48, 38.35], population: 10499000, area: 143100, government: 'Presidentielt republikk' },
  { name: 'Taiwan', capital: 'Taipei', code: 'TW', continent: 'Asia', capitalCoordinates: [121.3, 25.03], population: 23317031, area: 36197, government: 'Semi-presidentielt republikk' },
  { name: 'Thailand', capital: 'Bangkok', code: 'TH', continent: 'Asia', capitalCoordinates: [100.31, 13.45], population: 65859640, area: 513120, government: 'Konstitusjonelt monarki' },
  { name: 'Timor-Leste', capital: 'Dili', code: 'TL', continent: 'Asia', capitalCoordinates: [125.36, -8.35], population: 1391221, area: 14874, government: 'Semi-presidentielt republikk' },
  { name: 'Turkmenistan', capital: 'Asjkhabad', code: 'TM', continent: 'Asia', capitalCoordinates: [58.23, 37.57], population: 7057841, area: 488100, government: 'Presidentielt republikk' },
  { name: 'Tyrkia', capital: 'Ankara', code: 'TR', continent: 'Europa', capitalCoordinates: [32.52, 39.56], population: 85664944, area: 783562, government: 'Presidentielt republikk' },
  { name: 'Usbekistan', capital: 'Tasjkent', code: 'UZ', continent: 'Asia', capitalCoordinates: [69.18, 41.2], population: 37859698, area: 447400, government: 'Presidentielt republikk' },
  { name: 'Vietnam', capital: 'Hanoi', code: 'VN', continent: 'Asia', capitalCoordinates: [105.51, 21.02], population: 101343800, area: 331212, government: 'Kommunistisk ettpartistyre' },

  // ============================================
  // AFRIKA (54 land)
  // ============================================
  { name: 'Algeria', capital: 'Alger', code: 'DZ', continent: 'Afrika', capitalCoordinates: [3.03, 36.45], population: 47400000, area: 2381741, government: 'Semi-presidentielt republikk' },
  { name: 'Angola', capital: 'Luanda', code: 'AO', continent: 'Afrika', capitalCoordinates: [13.14, -8.5], population: 36170961, area: 1246700, government: 'Presidentielt republikk' },
  { name: 'Benin', capital: 'Porto-Novo', code: 'BJ', continent: 'Afrika', capitalCoordinates: [2.37, 6.29], population: 13224860, area: 112622, government: 'Presidentielt republikk' },
  { name: 'Botswana', capital: 'Gaborone', code: 'BW', continent: 'Afrika', capitalCoordinates: [25.55, -24.45], population: 2359609, area: 582000, government: 'Parlamentarisk republikk' },
  { name: 'Burkina Faso', capital: 'Ouagadougou', code: 'BF', continent: 'Afrika', capitalCoordinates: [-1.31, 12.22], population: 24070553, area: 272967, government: 'Semi-presidentielt republikk' },
  { name: 'Burundi', capital: 'Gitega', code: 'BI', continent: 'Afrika', capitalCoordinates: [29.21, -3.22], population: 12332788, area: 27834, government: 'Presidentielt republikk' },
  { name: 'Kamerun', capital: 'Yaoundé', code: 'CM', continent: 'Afrika', capitalCoordinates: [11.31, 3.52], population: 29442327, area: 475442, government: 'Presidentielt republikk' },
  { name: 'Kapp Verde', capital: 'Praia', code: 'CV', continent: 'Afrika', capitalCoordinates: [-23.31, 14.55], population: 491233, area: 4033, government: 'Semi-presidentielt republikk' },
  { name: 'Den sentralafrikanske republikk', capital: 'Bangui', code: 'CF', continent: 'Afrika', capitalCoordinates: [18.35, 4.22], population: 6470307, area: 622984, government: 'Semi-presidentielt republikk' },
  { name: 'Tsjad', capital: "N'Djamena", code: 'TD', continent: 'Afrika', capitalCoordinates: [15.02, 12.11], population: 19340757, area: 1284000, government: 'Presidentielt republikk' },
  { name: 'Komorene', capital: 'Moroni', code: 'KM', continent: 'Afrika', capitalCoordinates: [43.14, -11.42], population: 919901, area: 1862, government: 'Semi-presidentielt republikk' },
  { name: 'Republikken Kongo', capital: 'Brazzaville', code: 'CG', continent: 'Afrika', capitalCoordinates: [15.17, -4.15], population: 6142180, area: 342000, government: 'Semi-presidentielt republikk' },
  { name: 'Den demokratiske republikken Kongo', capital: 'Kinshasa', code: 'CD', continent: 'Afrika', capitalCoordinates: [15.18, -4.19], population: 112832000, area: 2344858, government: 'Semi-presidentielt republikk' },
  { name: 'Elfenbenskysten', capital: 'Yamoussoukro', code: 'CI', continent: 'Afrika', capitalCoordinates: [-5.17, 6.49], population: 31719275, area: 322463, government: 'Presidentielt republikk' },
  { name: 'Djibouti', capital: 'Djibouti', code: 'DJ', continent: 'Afrika', capitalCoordinates: [43.09, 11.35], population: 1066809, area: 23200, government: 'Semi-presidentielt republikk' },
  { name: 'Egypt', capital: 'Kairo', code: 'EG', continent: 'Afrika', capitalCoordinates: [31.15, 30.03], population: 107271260, area: 1002450, government: 'Semi-presidentielt republikk' },
  { name: 'Ekvatorial-Guinea', capital: 'Malabo', code: 'GQ', continent: 'Afrika', capitalCoordinates: [8.47, 3.45], population: 1668768, area: 28051, government: 'Presidentielt republikk' },
  { name: 'Eritrea', capital: 'Asmara', code: 'ER', continent: 'Afrika', capitalCoordinates: [38.56, 15.2], population: 3607000, area: 117600, government: 'Presidentielt republikk' },
  { name: 'Eswatini', capital: 'Mbabane', code: 'SZ', continent: 'Afrika', capitalCoordinates: [31.06, -26.18], population: 1235549, area: 17364, government: 'Absolutt monarki' },
  { name: 'Etiopia', capital: 'Addis Abeba', code: 'ET', continent: 'Afrika', capitalCoordinates: [38.42, 9.02], population: 111652998, area: 1104300, government: 'Parlamentarisk føderal republikk' },
  { name: 'Gabon', capital: 'Libreville', code: 'GA', continent: 'Afrika', capitalCoordinates: [9.27, 0.23], population: 2469296, area: 267668, government: 'Presidentielt republikk' },
  { name: 'Gambia', capital: 'Banjul', code: 'GM', continent: 'Afrika', capitalCoordinates: [-16.34, 13.27], population: 2422712, area: 10689, government: 'Presidentielt republikk' },
  { name: 'Ghana', capital: 'Accra', code: 'GH', continent: 'Afrika', capitalCoordinates: [-0.13, 5.33], population: 33742380, area: 238533, government: 'Presidentielt republikk' },
  { name: 'Guinea', capital: 'Conakry', code: 'GN', continent: 'Afrika', capitalCoordinates: [-13.42, 9.33], population: 14363931, area: 245857, government: 'Semi-presidentielt republikk' },
  { name: 'Guinea-Bissau', capital: 'Bissau', code: 'GW', continent: 'Afrika', capitalCoordinates: [-15.35, 11.51], population: 1781308, area: 36125, government: 'Semi-presidentielt republikk' },
  { name: 'Kenya', capital: 'Nairobi', code: 'KE', continent: 'Afrika', capitalCoordinates: [36.49, -1.17], population: 53330978, area: 580367, government: 'Presidentielt republikk' },
  { name: 'Lesotho', capital: 'Maseru', code: 'LS', continent: 'Afrika', capitalCoordinates: [27.29, -29.19], population: 2116427, area: 30355, government: 'Konstitusjonelt monarki' },
  { name: 'Liberia', capital: 'Monrovia', code: 'LR', continent: 'Afrika', capitalCoordinates: [-10.48, 6.18], population: 5248621, area: 111369, government: 'Presidentielt republikk' },
  { name: 'Libya', capital: 'Tripoli', code: 'LY', continent: 'Afrika', capitalCoordinates: [13.1, 32.53], population: 7459000, area: 1759540, government: 'Provisorisk styre' },
  { name: 'Madagaskar', capital: 'Antananarivo', code: 'MG', continent: 'Afrika', capitalCoordinates: [47.31, -18.55], population: 31727042, area: 587041, government: 'Semi-presidentielt republikk' },
  { name: 'Malawi', capital: 'Lilongwe', code: 'MW', continent: 'Afrika', capitalCoordinates: [33.47, -13.59], population: 20734262, area: 118484, government: 'Presidentielt republikk' },
  { name: 'Mali', capital: 'Bamako', code: 'ML', continent: 'Afrika', capitalCoordinates: [-8, 12.39], population: 22395489, area: 1240192, government: 'Semi-presidentielt republikk' },
  { name: 'Mauritania', capital: 'Nouakchott', code: 'MR', continent: 'Afrika', capitalCoordinates: [-16.02, 18.07], population: 4927532, area: 1030700, government: 'Semi-presidentielt republikk' },
  { name: 'Mauritius', capital: 'Port Louis', code: 'MU', continent: 'Afrika', capitalCoordinates: [57.29, -20.09], population: 1243741, area: 2040, government: 'Parlamentarisk republikk' },
  { name: 'Marokko', capital: 'Rabat', code: 'MA', continent: 'Afrika', capitalCoordinates: [-6.49, 34.01], population: 36828330, area: 446550, government: 'Konstitusjonelt monarki' },
  { name: 'Mosambik', capital: 'Maputo', code: 'MZ', continent: 'Afrika', capitalCoordinates: [32.35, -25.57], population: 34090466, area: 801590, government: 'Semi-presidentielt republikk' },
  { name: 'Namibia', capital: 'Windhoek', code: 'NA', continent: 'Afrika', capitalCoordinates: [17.05, -22.34], population: 3022401, area: 825615, government: 'Semi-presidentielt republikk' },
  { name: 'Niger', capital: 'Niamey', code: 'NE', continent: 'Afrika', capitalCoordinates: [2.07, 13.31], population: 26312034, area: 1267000, government: 'Semi-presidentielt republikk' },
  { name: 'Nigeria', capital: 'Abuja', code: 'NG', continent: 'Afrika', capitalCoordinates: [7.32, 9.05], population: 223800000, area: 923768, government: 'Føderal presidentielt republikk' },
  { name: 'Rwanda', capital: 'Kigali', code: 'RW', continent: 'Afrika', capitalCoordinates: [30.04, -1.57], population: 14104969, area: 26338, government: 'Presidentielt republikk' },
  { name: 'São Tomé og Príncipe', capital: 'São Tomé', code: 'ST', continent: 'Afrika', capitalCoordinates: [6.39, 0.12], population: 209607, area: 964, government: 'Semi-presidentielt republikk' },
  { name: 'Senegal', capital: 'Dakar', code: 'SN', continent: 'Afrika', capitalCoordinates: [-17.26, 14.4], population: 18593258, area: 196722, government: 'Semi-presidentielt republikk' },
  { name: 'Seychellene', capital: 'Victoria', code: 'SC', continent: 'Afrika', capitalCoordinates: [55.27, -4.38], population: 122729, area: 452, government: 'Presidentielt republikk' },
  { name: 'Sierra Leone', capital: 'Freetown', code: 'SL', continent: 'Afrika', capitalCoordinates: [-13.15, 8.3], population: 9077691, area: 71740, government: 'Presidentielt republikk' },
  { name: 'Somalia', capital: 'Mogadishu', code: 'SO', continent: 'Afrika', capitalCoordinates: [45.22, 2.04], population: 19655000, area: 637657, government: 'Føderal parlamentarisk republikk' },
  { name: 'Sør-Afrika', capital: 'Pretoria', code: 'ZA', continent: 'Afrika', capitalCoordinates: [28.13, -25.42], population: 63100945, area: 1221037, government: 'Parlamentarisk republikk' },
  { name: 'Sør-Sudan', capital: 'Juba', code: 'SS', continent: 'Afrika', capitalCoordinates: [31.58, 4.85], population: 15786898, area: 619745, government: 'Presidentielt republikk' },
  { name: 'Sudan', capital: 'Khartoum', code: 'SD', continent: 'Afrika', capitalCoordinates: [32.32, 15.36], population: 51662000, area: 1886068, government: 'Føderal presidentielt republikk' },
  { name: 'Tanzania', capital: 'Dodoma', code: 'TZ', continent: 'Afrika', capitalCoordinates: [39.17, -6.48], population: 68153004, area: 947303, government: 'Presidentielt republikk' },
  { name: 'Togo', capital: 'Lomé', code: 'TG', continent: 'Afrika', capitalCoordinates: [1.13, 6.08], population: 8095498, area: 56785, government: 'Presidentielt republikk' },
  { name: 'Tunisia', capital: 'Tunis', code: 'TN', continent: 'Afrika', capitalCoordinates: [10.11, 36.48], population: 11972169, area: 163610, government: 'Semi-presidentielt republikk' },
  { name: 'Uganda', capital: 'Kampala', code: 'UG', continent: 'Afrika', capitalCoordinates: [32.25, 0.19], population: 45905417, area: 241550, government: 'Presidentielt republikk' },
  { name: 'Zambia', capital: 'Lusaka', code: 'ZM', continent: 'Afrika', capitalCoordinates: [28.17, -15.25], population: 19693423, area: 752612, government: 'Presidentielt republikk' },
  { name: 'Zimbabwe', capital: 'Harare', code: 'ZW', continent: 'Afrika', capitalCoordinates: [31.03, -17.5], population: 17073087, area: 390757, government: 'Presidentielt republikk' },

  // ============================================
  // NORD-AMERIKA (23 land)
  // ============================================
  { name: 'Antigua og Barbuda', capital: 'Saint John\'s', code: 'AG', continent: 'Nord-Amerika', capitalCoordinates: [-61.85, 17.12], population: 103603, area: 442, government: 'Konstitusjonelt monarki' },
  { name: 'Bahamas', capital: 'Nassau', code: 'BS', continent: 'Nord-Amerika', capitalCoordinates: [-77.21, 25.05], population: 398165, area: 13943, government: 'Konstitusjonelt monarki' },
  { name: 'Barbados', capital: 'Bridgetown', code: 'BB', continent: 'Nord-Amerika', capitalCoordinates: [-59.37, 13.06], population: 267800, area: 430, government: 'Konstitusjonelt monarki' },
  { name: 'Belize', capital: 'Belmopan', code: 'BZ', continent: 'Nord-Amerika', capitalCoordinates: [-88.46, 17.15], population: 417634, area: 22966, government: 'Konstitusjonelt monarki' },
  { name: 'Canada', capital: 'Ottawa', code: 'CA', continent: 'Nord-Amerika', capitalCoordinates: [-75.42, 45.25], population: 41651653, area: 9984670, government: 'Konstitusjonelt monarki' },
  { name: 'Costa Rica', capital: 'San José', code: 'CR', continent: 'Nord-Amerika', capitalCoordinates: [-84.05, 9.56], population: 5309625, area: 51100, government: 'Presidentielt republikk' },
  { name: 'Cuba', capital: 'Havana', code: 'CU', continent: 'Nord-Amerika', capitalCoordinates: [-82.21, 23.07], population: 9748007, area: 109884, government: 'Kommunistisk ettpartistyre' },
  { name: 'Dominica', capital: 'Roseau', code: 'DM', continent: 'Nord-Amerika', capitalCoordinates: [-61.24, 15.18], population: 67408, area: 751, government: 'Parlamentarisk republikk' },
  { name: 'Den dominikanske republikk', capital: 'Santo Domingo', code: 'DO', continent: 'Nord-Amerika', capitalCoordinates: [-69.54, 18.28], population: 10771504, area: 48671, government: 'Presidentielt republikk' },
  { name: 'El Salvador', capital: 'San Salvador', code: 'SV', continent: 'Nord-Amerika', capitalCoordinates: [-89.12, 13.42], population: 6029976, area: 21041, government: 'Presidentielt republikk' },
  { name: 'Grenada', capital: 'Saint George\'s', code: 'GD', continent: 'Nord-Amerika', capitalCoordinates: [-61.75, 12.05], population: 109021, area: 344, government: 'Konstitusjonelt monarki' },
  { name: 'Guatemala', capital: 'Guatemala by', code: 'GT', continent: 'Nord-Amerika', capitalCoordinates: [-90.31, 14.37], population: 18079810, area: 108889, government: 'Presidentielt republikk' },
  { name: 'Haiti', capital: 'Port-au-Prince', code: 'HT', continent: 'Nord-Amerika', capitalCoordinates: [-72.2, 18.32], population: 11867032, area: 27750, government: 'Semi-presidentielt republikk' },
  { name: 'Honduras', capital: 'Tegucigalpa', code: 'HN', continent: 'Nord-Amerika', capitalCoordinates: [-87.13, 14.06], population: 9892632, area: 112492, government: 'Presidentielt republikk' },
  { name: 'Jamaica', capital: 'Kingston', code: 'JM', continent: 'Nord-Amerika', capitalCoordinates: [-76.48, 18], population: 2825544, area: 10991, government: 'Konstitusjonelt monarki' },
  { name: 'Mexico', capital: 'Mexico by', code: 'MX', continent: 'Nord-Amerika', capitalCoordinates: [-99.08, 19.26], population: 130575786, area: 1964375, government: 'Føderal presidentielt republikk' },
  { name: 'Nicaragua', capital: 'Managua', code: 'NI', continent: 'Nord-Amerika', capitalCoordinates: [-86.17, 12.09], population: 6803886, area: 130373, government: 'Presidentielt republikk' },
  { name: 'Panama', capital: 'Panama by', code: 'PA', continent: 'Nord-Amerika', capitalCoordinates: [-79.32, 8.58], population: 4064780, area: 75417, government: 'Presidentielt republikk' },
  { name: 'Saint Kitts og Nevis', capital: 'Basseterre', code: 'KN', continent: 'Nord-Amerika', capitalCoordinates: [-62.43, 17.18], population: 51320, area: 261, government: 'Konstitusjonelt monarki' },
  { name: 'Saint Lucia', capital: 'Castries', code: 'LC', continent: 'Nord-Amerika', capitalCoordinates: [-61, 14.01], population: 184100, area: 616, government: 'Konstitusjonelt monarki' },
  { name: 'Saint Vincent og Grenadinene', capital: 'Kingstown', code: 'VC', continent: 'Nord-Amerika', capitalCoordinates: [-61.14, 13.09], population: 110872, area: 389, government: 'Konstitusjonelt monarki' },
  { name: 'Trinidad og Tobago', capital: 'Port of Spain', code: 'TT', continent: 'Nord-Amerika', capitalCoordinates: [-61.31, 10.39], population: 1367764, area: 5130, government: 'Parlamentarisk republikk' },
  { name: 'USA', capital: 'Washington D.C.', code: 'US', continent: 'Nord-Amerika', capitalCoordinates: [-77.02, 38.53], population: 340110988, area: 9525067, government: 'Føderal presidentielt republikk' },

  // ============================================
  // SØR-AMERIKA (12 land)
  // ============================================
  { name: 'Argentina', capital: 'Buenos Aires', code: 'AR', continent: 'Sør-Amerika', capitalCoordinates: [-58.4, -34.36], population: 46735004, area: 2780400, government: 'Føderal presidentielt republikk' },
  { name: 'Bolivia', capital: 'Sucre', code: 'BO', continent: 'Sør-Amerika', capitalCoordinates: [-68.09, -16.3], population: 11365333, area: 1098581, government: 'Presidentielt republikk' },
  { name: 'Brasil', capital: 'Brasília', code: 'BR', continent: 'Sør-Amerika', capitalCoordinates: [-47.55, -15.47], population: 213421037, area: 8515767, government: 'Føderal presidentielt republikk' },
  { name: 'Chile', capital: 'Santiago', code: 'CL', continent: 'Sør-Amerika', capitalCoordinates: [-70.4, -33.27], population: 20206953, area: 756102, government: 'Presidentielt republikk' },
  { name: 'Colombia', capital: 'Bogotá', code: 'CO', continent: 'Sør-Amerika', capitalCoordinates: [-74.05, 4.36], population: 53057212, area: 1141748, government: 'Presidentielt republikk' },
  { name: 'Ecuador', capital: 'Quito', code: 'EC', continent: 'Sør-Amerika', capitalCoordinates: [-78.3, -0.13], population: 18103660, area: 276841, government: 'Presidentielt republikk' },
  { name: 'Guyana', capital: 'Georgetown', code: 'GY', continent: 'Sør-Amerika', capitalCoordinates: [-58.1, 6.48], population: 772975, area: 214969, government: 'Semi-presidentielt republikk' },
  { name: 'Paraguay', capital: 'Asunción', code: 'PY', continent: 'Sør-Amerika', capitalCoordinates: [-57.4, -25.16], population: 6109644, area: 406752, government: 'Presidentielt republikk' },
  { name: 'Peru', capital: 'Lima', code: 'PE', continent: 'Sør-Amerika', capitalCoordinates: [-77.03, -12.03], population: 34350244, area: 1285216, government: 'Presidentielt republikk' },
  { name: 'Surinam', capital: 'Paramaribo', code: 'SR', continent: 'Sør-Amerika', capitalCoordinates: [-55.1, 5.5], population: 616500, area: 163820, government: 'Parlamentarisk republikk' },
  { name: 'Uruguay', capital: 'Montevideo', code: 'UY', continent: 'Sør-Amerika', capitalCoordinates: [-56.11, -34.53], population: 3499451, area: 181034, government: 'Presidentielt republikk' },
  { name: 'Venezuela', capital: 'Caracas', code: 'VE', continent: 'Sør-Amerika', capitalCoordinates: [-66.56, 10.3], population: 28517000, area: 916445, government: 'Føderal presidentielt republikk' },

  // ============================================
  // OSEANIA (14 land)
  // ============================================
  { name: 'Australia', capital: 'Canberra', code: 'AU', continent: 'Oseania', capitalCoordinates: [149.13, -35.17], population: 27536874, area: 7692024, government: 'Konstitusjonelt monarki' },
  { name: 'Fiji', capital: 'Suva', code: 'FJ', continent: 'Oseania', capitalCoordinates: [178.25, -18.08], population: 900869, area: 18272, government: 'Parlamentarisk republikk' },
  { name: 'Kiribati', capital: 'Tarawa', code: 'KI', continent: 'Oseania', capitalCoordinates: [172.58, 1.19], population: 120740, area: 811, government: 'Parlamentarisk republikk' },
  { name: 'Marshalløyene', capital: 'Majuro', code: 'MH', continent: 'Oseania', capitalCoordinates: [171.23, 7.06], population: 42418, area: 181, government: 'Parlamentarisk republikk' },
  { name: 'Mikronesia', capital: 'Palikir', code: 'FM', continent: 'Oseania', capitalCoordinates: [158.09, 6.55], population: 105564, area: 702, government: 'Føderal parlamentarisk republikk' },
  { name: 'Nauru', capital: 'Yaren', code: 'NR', continent: 'Oseania', capitalCoordinates: [166.55, -0.32], population: 11680, area: 21, government: 'Parlamentarisk republikk' },
  { name: 'New Zealand', capital: 'Wellington', code: 'NZ', continent: 'Oseania', capitalCoordinates: [174.51, -41.28], population: 5324700, area: 268838, government: 'Konstitusjonelt monarki' },
  { name: 'Palau', capital: 'Ngerulmud', code: 'PW', continent: 'Oseania', capitalCoordinates: [134.38, 7.29], population: 16733, area: 459, government: 'Presidentielt republikk' },
  { name: 'Papua Ny-Guinea', capital: 'Port Moresby', code: 'PG', continent: 'Oseania', capitalCoordinates: [147.1, -9.3], population: 11781559, area: 462840, government: 'Konstitusjonelt monarki' },
  { name: 'Samoa', capital: 'Apia', code: 'WS', continent: 'Oseania', capitalCoordinates: [-171.44, -13.5], population: 205557, area: 2842, government: 'Parlamentarisk republikk' },
  { name: 'Salomonøyene', capital: 'Honiara', code: 'SB', continent: 'Oseania', capitalCoordinates: [159.57, -9.26], population: 750325, area: 28896, government: 'Konstitusjonelt monarki' },
  { name: 'Tonga', capital: 'Nukualofa', code: 'TO', continent: 'Oseania', capitalCoordinates: [-175.12, -21.08], population: 100179, area: 747, government: 'Konstitusjonelt monarki' },
  { name: 'Tuvalu', capital: 'Funafuti', code: 'TV', continent: 'Oseania', capitalCoordinates: [179.12, -8.3], population: 10643, area: 26, government: 'Konstitusjonelt monarki' },
  { name: 'Vanuatu', capital: 'Port Vila', code: 'VU', continent: 'Oseania', capitalCoordinates: [168.19, -17.44], population: 321409, area: 12189, government: 'Parlamentarisk republikk' },
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
