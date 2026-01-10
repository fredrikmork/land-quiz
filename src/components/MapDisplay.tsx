import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import countries from 'i18n-iso-countries'

// Use 50m for more detail (includes more small countries)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'

// Convert alpha-2 to alpha-3 using i18n-iso-countries
function getAlpha3(alpha2: string): string {
  // Special cases for countries not in standard ISO
  if (alpha2 === 'XK') return 'XKX'
  if (alpha2 === 'SM') return 'SMR'
  return countries.alpha2ToAlpha3(alpha2) || alpha2
}

// Map alpha-3 to numeric codes (world-atlas uses numeric IDs)
const alpha3ToNumeric: Record<string, string> = {
  AFG: '004', ALB: '008', DZA: '012', AND: '020', AGO: '024', ATG: '028', ARG: '032',
  ARM: '051', AUS: '036', AUT: '040', AZE: '031', BHS: '044', BHR: '048', BGD: '050',
  BRB: '052', BLR: '112', BEL: '056', BLZ: '084', BEN: '204', BTN: '064', BOL: '068',
  BIH: '070', BWA: '072', BRA: '076', BRN: '096', BGR: '100', BFA: '854', BDI: '108',
  CPV: '132', KHM: '116', CMR: '120', CAN: '124', CAF: '140', TCD: '148', CHL: '152',
  CHN: '156', COL: '170', COM: '174', COG: '178', COD: '180', CRI: '188', CIV: '384',
  HRV: '191', CUB: '192', CYP: '196', CZE: '203', DNK: '208', DJI: '262', DMA: '212',
  DOM: '214', ECU: '218', EGY: '818', SLV: '222', GNQ: '226', ERI: '232', EST: '233',
  SWZ: '748', ETH: '231', FJI: '242', FIN: '246', FRA: '250', GAB: '266', GMB: '270',
  GEO: '268', DEU: '276', GHA: '288', GRC: '300', GRD: '308', GTM: '320', GIN: '324',
  GNB: '624', GUY: '328', HTI: '332', HND: '340', HUN: '348', ISL: '352', IND: '356',
  IDN: '360', IRN: '364', IRQ: '368', IRL: '372', ISR: '376', ITA: '380', JAM: '388',
  JPN: '392', JOR: '400', KAZ: '398', KEN: '404', KIR: '296', PRK: '408', KOR: '410',
  KWT: '414', KGZ: '417', LAO: '418', LVA: '428', LBN: '422', LSO: '426', LBR: '430',
  LBY: '434', LIE: '438', LTU: '440', LUX: '442', MDG: '450', MWI: '454', MYS: '458',
  MDV: '462', MLI: '466', MLT: '470', MHL: '584', MRT: '478', MUS: '480', MEX: '484',
  FSM: '583', MDA: '498', MCO: '492', MNG: '496', MNE: '499', MAR: '504', MOZ: '508',
  MMR: '104', NAM: '516', NRU: '520', NPL: '524', NLD: '528', NZL: '554', NIC: '558',
  NER: '562', NGA: '566', MKD: '807', NOR: '578', OMN: '512', PAK: '586', PLW: '585',
  PAN: '591', PNG: '598', PRY: '600', PER: '604', PHL: '608', POL: '616', PRT: '620', PSE: '275',
  QAT: '634', ROU: '642', RUS: '643', RWA: '646', KNA: '659', LCA: '662', VCT: '670',
  WSM: '882', SMR: '674', STP: '678', SAU: '682', SEN: '686', SRB: '688', SYC: '690',
  SLE: '694', SGP: '702', SVK: '703', SVN: '705', SLB: '090', SOM: '706', ZAF: '710',
  SSD: '728', ESP: '724', LKA: '144', SDN: '729', SUR: '740', SWE: '752', CHE: '756',
  SYR: '760', TWN: '158', TJK: '762', TZA: '834', THA: '764', TLS: '626', TGO: '768',
  TON: '776', TTO: '780', TUN: '788', TUR: '792', TKM: '795', TUV: '798', UGA: '800',
  UKR: '804', ARE: '784', GBR: '826', USA: '840', URY: '858', UZB: '860', VUT: '548',
  VAT: '336', VEN: '862', VNM: '704', YEM: '887', ZMB: '894', ZWE: '716', XKX: '-99',
}

// Small countries that don't appear on the map - show marker instead
// Only truly tiny countries that are missing from world-atlas 50m
const smallCountryCoords: Record<string, [number, number]> = {
  AND: [1.5, 42.5], MCO: [7.4, 43.7], VAT: [12.45, 41.9], LIE: [9.5, 47.2],
  SMR: [12.45, 43.94], SGP: [103.8, 1.35], BHR: [50.5, 26], MDV: [73, 3.2], SYC: [55.5, -4.7],
  MUS: [57.5, -20.3], COM: [43.3, -11.8], STP: [6.7, 0.3], BRB: [-59.5, 13.2],
  ATG: [-61.8, 17.1], KNA: [-62.7, 17.3], LCA: [-61, 13.9], VCT: [-61.2, 13.2],
  GRD: [-61.7, 12.1], DMA: [-61.4, 15.4], NRU: [166.9, -0.5], TUV: [179, -8],
  PLW: [134.5, 7.5], MHL: [171, 7], KIR: [-157, 1.8], TON: [-175, -21],
  XKX: [21, 42.5], // Kosovo - not in standard datasets
}

// Zoom configurations for different countries/regions
const zoomConfig: Record<string, { center: [number, number]; zoom: number }> = {
  // Europe
  ALB: { center: [20, 41], zoom: 7 },
  AND: { center: [1.5, 42.5], zoom: 10 },
  AUT: { center: [14, 47], zoom: 6 },
  BEL: { center: [4, 50], zoom: 7 },
  BGR: { center: [25, 43], zoom: 6 },
  BIH: { center: [18, 44], zoom: 6 },
  BLR: { center: [28, 53], zoom: 5 },
  CHE: { center: [8, 47], zoom: 7 },
  CYP: { center: [33, 35], zoom: 7 },
  CZE: { center: [15, 50], zoom: 6 },
  DEU: { center: [10, 51], zoom: 5 },
  DNK: { center: [10, 56], zoom: 6 },
  ESP: { center: [-4, 40], zoom: 5 },
  EST: { center: [25, 59], zoom: 6 },
  FIN: { center: [26, 64], zoom: 4 },
  FRA: { center: [2, 47], zoom: 5 },
  GBR: { center: [-2, 54], zoom: 5 },
  GRC: { center: [22, 39], zoom: 5 },
  HRV: { center: [16, 45], zoom: 6 },
  HUN: { center: [19, 47], zoom: 6 },
  IRL: { center: [-8, 53], zoom: 6 },
  ISL: { center: [-19, 65], zoom: 6 },
  ITA: { center: [12, 43], zoom: 5 },
  LIE: { center: [9.5, 47.2], zoom: 10 },
  LTU: { center: [24, 55], zoom: 6 },
  LUX: { center: [6, 49.7], zoom: 9 },
  LVA: { center: [25, 57], zoom: 6 },
  MCO: { center: [7.4, 43.7], zoom: 12 },
  MDA: { center: [29, 47], zoom: 6 },
  MKD: { center: [21.5, 41.5], zoom: 7 },
  MLT: { center: [14.5, 35.9], zoom: 10 },
  MNE: { center: [19, 42.5], zoom: 7 },
  NLD: { center: [5, 52], zoom: 7 },
  NOR: { center: [10, 62], zoom: 4 },
  POL: { center: [19, 52], zoom: 5 },
  PRT: { center: [-8, 39], zoom: 6 },
  ROU: { center: [25, 46], zoom: 5 },
  RUS: { center: [100, 60], zoom: 1.5 },
  SMR: { center: [12.4, 43.9], zoom: 12 },
  SRB: { center: [21, 44], zoom: 6 },
  SVK: { center: [19.5, 48.7], zoom: 6 },
  SVN: { center: [14.5, 46], zoom: 7 },
  SWE: { center: [16, 62], zoom: 4 },
  TUR: { center: [35, 39], zoom: 4 },
  UKR: { center: [32, 49], zoom: 4 },
  VAT: { center: [12.45, 41.9], zoom: 14 },
  XKX: { center: [21, 42.5], zoom: 8 },
  // Asia
  AFG: { center: [66, 33], zoom: 5 },
  ARE: { center: [54, 24], zoom: 6 },
  ARM: { center: [45, 40], zoom: 7 },
  AZE: { center: [47.5, 40.5], zoom: 6 },
  BGD: { center: [90, 24], zoom: 5 },
  BHR: { center: [50.5, 26], zoom: 9 },
  BRN: { center: [114.7, 4.5], zoom: 8 },
  BTN: { center: [90.5, 27.5], zoom: 7 },
  CHN: { center: [105, 35], zoom: 2.5 },
  GEO: { center: [43.5, 42], zoom: 6 },
  IDN: { center: [118, -2], zoom: 3 },
  IND: { center: [80, 22], zoom: 3 },
  IRN: { center: [54, 32], zoom: 4 },
  IRQ: { center: [44, 33], zoom: 5 },
  ISR: { center: [35, 31], zoom: 6 },
  JOR: { center: [36, 31], zoom: 6 },
  PSE: { center: [35.2, 31.9], zoom: 8 },
  JPN: { center: [138, 36], zoom: 4 },
  KAZ: { center: [67, 48], zoom: 3 },
  KGZ: { center: [74, 41], zoom: 5 },
  KHM: { center: [105, 12.5], zoom: 5 },
  KOR: { center: [128, 36], zoom: 5 },
  KWT: { center: [47.5, 29.5], zoom: 7 },
  LAO: { center: [103, 18], zoom: 5 },
  LBN: { center: [35.8, 33.8], zoom: 7 },
  LKA: { center: [81, 7.5], zoom: 6 },
  MDV: { center: [73, 3.2], zoom: 7 },
  MMR: { center: [96, 20], zoom: 4 },
  MNG: { center: [103, 46], zoom: 3 },
  MYS: { center: [109, 4], zoom: 4 },
  NPL: { center: [84, 28], zoom: 5 },
  OMN: { center: [56, 21], zoom: 5 },
  PAK: { center: [69, 30], zoom: 4 },
  PHL: { center: [122, 12], zoom: 4 },
  PRK: { center: [127, 40], zoom: 5 },
  QAT: { center: [51, 25.5], zoom: 7 },
  SAU: { center: [45, 24], zoom: 4 },
  SGP: { center: [103.8, 1.35], zoom: 10 },
  SYR: { center: [38, 35], zoom: 5 },
  THA: { center: [101, 15], zoom: 4 },
  TJK: { center: [69, 39], zoom: 5 },
  TKM: { center: [59, 39], zoom: 4 },
  TLS: { center: [126, -8.8], zoom: 7 },
  TWN: { center: [121, 24], zoom: 6 },
  UZB: { center: [63, 41], zoom: 4 },
  VNM: { center: [108, 16], zoom: 4 },
  YEM: { center: [48, 15.5], zoom: 5 },
  // Americas
  ARG: { center: [-64, -35], zoom: 2.5 },
  ATG: { center: [-61.8, 17.1], zoom: 10 },
  BHS: { center: [-77, 24], zoom: 6 },
  BLZ: { center: [-88.5, 17], zoom: 7 },
  BOL: { center: [-64, -17], zoom: 4 },
  BRA: { center: [-52, -14], zoom: 2.5 },
  BRB: { center: [-59.5, 13.2], zoom: 10 },
  CAN: { center: [-100, 60], zoom: 2 },
  CHL: { center: [-71, -35], zoom: 2.5 },
  COL: { center: [-72, 4], zoom: 3.5 },
  CRI: { center: [-84, 10], zoom: 6 },
  CUB: { center: [-79, 22], zoom: 5 },
  DOM: { center: [-70, 19], zoom: 6 },
  ECU: { center: [-78.5, -1.5], zoom: 5 },
  GTM: { center: [-90.5, 15.5], zoom: 6 },
  GUY: { center: [-59, 5], zoom: 5 },
  HND: { center: [-86.5, 15], zoom: 6 },
  HTI: { center: [-72.3, 19], zoom: 6 },
  JAM: { center: [-77.3, 18.1], zoom: 7 },
  MEX: { center: [-102, 24], zoom: 3 },
  NIC: { center: [-85, 13], zoom: 6 },
  PAN: { center: [-80, 9], zoom: 6 },
  PER: { center: [-76, -10], zoom: 3.5 },
  PRY: { center: [-58, -23], zoom: 5 },
  SLV: { center: [-89, 13.8], zoom: 7 },
  SUR: { center: [-56, 4], zoom: 6 },
  TTO: { center: [-61, 10.5], zoom: 8 },
  URY: { center: [-56, -33], zoom: 5 },
  USA: { center: [-98, 39], zoom: 2.5 },
  VCT: { center: [-61.2, 13.2], zoom: 10 },
  VEN: { center: [-66, 8], zoom: 4 },
  // Africa
  AGO: { center: [17.5, -12.5], zoom: 4 },
  BDI: { center: [30, -3.3], zoom: 7 },
  BEN: { center: [2.3, 9.3], zoom: 6 },
  BFA: { center: [-1.5, 12.3], zoom: 5 },
  BWA: { center: [24, -22], zoom: 4 },
  CAF: { center: [21, 6.5], zoom: 4 },
  CIV: { center: [-5.5, 7.5], zoom: 5 },
  CMR: { center: [12.5, 6], zoom: 4 },
  COD: { center: [23, -3], zoom: 3 },
  COG: { center: [15, -1], zoom: 4 },
  COM: { center: [43.3, -11.8], zoom: 8 },
  CPV: { center: [-24, 16], zoom: 7 },
  DJI: { center: [42.5, 11.5], zoom: 7 },
  DZA: { center: [3, 28], zoom: 3 },
  EGY: { center: [30, 27], zoom: 4 },
  ERI: { center: [39, 15], zoom: 5 },
  ETH: { center: [39, 9], zoom: 4 },
  GAB: { center: [11.5, -0.8], zoom: 5 },
  GHA: { center: [-1.2, 8], zoom: 5 },
  GIN: { center: [-10, 10.5], zoom: 5 },
  GMB: { center: [-15.5, 13.5], zoom: 8 },
  GNB: { center: [-15, 12], zoom: 7 },
  GNQ: { center: [10.5, 1.5], zoom: 7 },
  KEN: { center: [38, 0], zoom: 5 },
  LBR: { center: [-9.5, 6.5], zoom: 6 },
  LBY: { center: [18, 27], zoom: 4 },
  LSO: { center: [28.5, -29.5], zoom: 7 },
  MAR: { center: [-6, 32], zoom: 5 },
  MDG: { center: [47, -19], zoom: 4 },
  MLI: { center: [-4, 17], zoom: 3 },
  MOZ: { center: [35, -18], zoom: 4 },
  MRT: { center: [-10, 20], zoom: 4 },
  MUS: { center: [57.5, -20.3], zoom: 9 },
  MWI: { center: [34, -13.5], zoom: 5 },
  NAM: { center: [17, -22], zoom: 4 },
  NER: { center: [9, 17], zoom: 4 },
  NGA: { center: [8, 10], zoom: 4 },
  RWA: { center: [30, -2], zoom: 7 },
  SDN: { center: [30, 15], zoom: 4 },
  SEN: { center: [-14.5, 14.5], zoom: 5 },
  SLE: { center: [-11.8, 8.5], zoom: 6 },
  SOM: { center: [46, 5], zoom: 4 },
  SYC: { center: [55.5, -4.7], zoom: 8 },
  SSD: { center: [30, 7], zoom: 4 },
  STP: { center: [6.7, 0.3], zoom: 9 },
  SWZ: { center: [31.5, -26.5], zoom: 7 },
  TCD: { center: [18, 15], zoom: 3 },
  TGO: { center: [1, 8.5], zoom: 6 },
  TUN: { center: [9.5, 34], zoom: 5 },
  TZA: { center: [35, -6], zoom: 4 },
  UGA: { center: [32.5, 1], zoom: 5 },
  ZAF: { center: [25, -29], zoom: 4 },
  ZMB: { center: [28, -14], zoom: 4 },
  ZWE: { center: [29.5, -19], zoom: 5 },
  // Oceania
  AUS: { center: [134, -25], zoom: 2.5 },
  FJI: { center: [178, -18], zoom: 6 },
  FSM: { center: [158, 6.9], zoom: 6 },
  KIR: { center: [-157, 1.8], zoom: 6 },
  MHL: { center: [171, 7], zoom: 6 },
  NRU: { center: [166.9, -0.5], zoom: 12 },
  NZL: { center: [172, -42], zoom: 4 },
  PLW: { center: [134.5, 7.5], zoom: 8 },
  PNG: { center: [145, -6], zoom: 4 },
  SLB: { center: [160, -9], zoom: 5 },
  TON: { center: [-175, -21], zoom: 7 },
  TUV: { center: [179, -8], zoom: 8 },
  VUT: { center: [167, -16], zoom: 5 },
  WSM: { center: [-172, -13.8], zoom: 7 },
}

interface MapDisplayProps {
  countryCode: string
}

export function MapDisplay({ countryCode }: MapDisplayProps) {
  const alpha3 = getAlpha3(countryCode)
  const numericCode = alpha3ToNumeric[alpha3]
  const config = zoomConfig[alpha3] || { center: [0, 20], zoom: 2 }
  const smallCountryMarker = smallCountryCoords[alpha3]

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden min-h-[250px] md:min-h-[400px] lg:min-h-[500px] touch-manipulation">
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
                // Check by numeric ID or by name property
                const geoId = geo.id?.toString()
                const isHighlighted = geoId === numericCode
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isHighlighted ? '#ef4444' : '#d1d5db',
                        stroke: isHighlighted ? '#ef4444' : '#9ca3af',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isHighlighted ? '#ef4444' : '#b8bfc9',
                        stroke: isHighlighted ? '#ef4444' : '#9ca3af',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      pressed: {
                        fill: isHighlighted ? '#ef4444' : '#b8bfc9',
                        stroke: isHighlighted ? '#ef4444' : '#9ca3af',
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {smallCountryMarker && (
            <Marker coordinates={smallCountryMarker}>
              <circle r={0.1} fill="#ef4444" />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
