import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import './MapDisplay.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Map ISO alpha-2 to ISO alpha-3 codes (world-atlas uses alpha-3)
const alpha2ToAlpha3: Record<string, string> = {
  NO: 'NOR', SE: 'SWE', DK: 'DNK', FI: 'FIN', IS: 'ISL',
  DE: 'DEU', FR: 'FRA', ES: 'ESP', IT: 'ITA', PT: 'PRT',
  GB: 'GBR', IE: 'IRL', NL: 'NLD', BE: 'BEL', CH: 'CHE',
  AT: 'AUT', PL: 'POL', CZ: 'CZE', HU: 'HUN', RO: 'ROU',
  BG: 'BGR', GR: 'GRC', TR: 'TUR', RU: 'RUS', UA: 'UKR',
  US: 'USA', CA: 'CAN', MX: 'MEX', BR: 'BRA', AR: 'ARG',
  CL: 'CHL', CO: 'COL', PE: 'PER', JP: 'JPN', CN: 'CHN',
  KR: 'KOR', IN: 'IND', ID: 'IDN', TH: 'THA', VN: 'VNM',
  AU: 'AUS', NZ: 'NZL', EG: 'EGY', ZA: 'ZAF', NG: 'NGA',
  KE: 'KEN', MA: 'MAR', SA: 'SAU', IL: 'ISR', IR: 'IRN',
}

// Zoom configurations for different countries/regions
const zoomConfig: Record<string, { center: [number, number]; zoom: number }> = {
  // Europe
  NOR: { center: [10, 62], zoom: 4 },
  SWE: { center: [16, 62], zoom: 4 },
  DNK: { center: [10, 56], zoom: 6 },
  FIN: { center: [26, 64], zoom: 4 },
  ISL: { center: [-19, 65], zoom: 6 },
  DEU: { center: [10, 51], zoom: 5 },
  FRA: { center: [2, 47], zoom: 5 },
  ESP: { center: [-4, 40], zoom: 5 },
  ITA: { center: [12, 43], zoom: 5 },
  PRT: { center: [-8, 39], zoom: 6 },
  GBR: { center: [-2, 54], zoom: 5 },
  IRL: { center: [-8, 53], zoom: 6 },
  NLD: { center: [5, 52], zoom: 7 },
  BEL: { center: [4, 50], zoom: 7 },
  CHE: { center: [8, 47], zoom: 7 },
  AUT: { center: [14, 47], zoom: 6 },
  POL: { center: [19, 52], zoom: 5 },
  CZE: { center: [15, 50], zoom: 6 },
  HUN: { center: [19, 47], zoom: 6 },
  ROU: { center: [25, 46], zoom: 5 },
  BGR: { center: [25, 43], zoom: 6 },
  GRC: { center: [22, 39], zoom: 5 },
  TUR: { center: [35, 39], zoom: 4 },
  RUS: { center: [100, 60], zoom: 1.5 },
  UKR: { center: [32, 49], zoom: 4 },
  // Americas
  USA: { center: [-98, 39], zoom: 2.5 },
  CAN: { center: [-100, 60], zoom: 2 },
  MEX: { center: [-102, 24], zoom: 3 },
  BRA: { center: [-52, -14], zoom: 2.5 },
  ARG: { center: [-64, -35], zoom: 2.5 },
  CHL: { center: [-71, -35], zoom: 2.5 },
  COL: { center: [-72, 4], zoom: 3.5 },
  PER: { center: [-76, -10], zoom: 3.5 },
  // Asia
  JPN: { center: [138, 36], zoom: 4 },
  CHN: { center: [105, 35], zoom: 2.5 },
  KOR: { center: [128, 36], zoom: 5 },
  IND: { center: [80, 22], zoom: 3 },
  IDN: { center: [118, -2], zoom: 3 },
  THA: { center: [101, 15], zoom: 4 },
  VNM: { center: [108, 16], zoom: 4 },
  SAU: { center: [45, 24], zoom: 4 },
  ISR: { center: [35, 31], zoom: 6 },
  IRN: { center: [54, 32], zoom: 4 },
  // Oceania
  AUS: { center: [134, -25], zoom: 2.5 },
  NZL: { center: [172, -42], zoom: 4 },
  // Africa
  EGY: { center: [30, 27], zoom: 4 },
  ZAF: { center: [25, -29], zoom: 4 },
  NGA: { center: [8, 10], zoom: 4 },
  KEN: { center: [38, 0], zoom: 5 },
  MAR: { center: [-6, 32], zoom: 5 },
}

interface MapDisplayProps {
  countryCode: string
}

export function MapDisplay({ countryCode }: MapDisplayProps) {
  const alpha3 = alpha2ToAlpha3[countryCode] || countryCode
  const config = zoomConfig[alpha3] || { center: [0, 20], zoom: 1 }

  return (
    <div className="map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
        }}
      >
        <ZoomableGroup center={config.center} zoom={config.zoom} minZoom={1} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = geo.properties.ISO_A3 === alpha3 || geo.id === alpha3
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={isHighlighted ? 'country highlighted' : 'country'}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
