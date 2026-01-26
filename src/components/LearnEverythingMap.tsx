import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import { countries as countriesData, getFlagUrl } from '../data/countries'
import {
  GEO_URL,
  getAlpha3,
  alpha3ToNumeric,
  smallCountryCoords,
  zoomConfig,
} from '../data/mapConfig'

interface LearnEverythingMapProps {
  countryCode: string
}

export function LearnEverythingMap({ countryCode }: LearnEverythingMapProps) {
  const alpha3 = getAlpha3(countryCode)
  const numericCode = alpha3ToNumeric[alpha3]
  const baseConfig = zoomConfig[alpha3] || { center: [0, 20], zoom: 2 }
  // Increase zoom by 50% for more detail
  const config = { ...baseConfig, zoom: baseConfig.zoom * 1.5 }

  // Get country data
  const country = countriesData.find(c => c.code === countryCode)

  // Very small countries that don't need a capital dot (country itself is tiny)
  // Countries under 1000 km² are too small for a visible capital dot
  const isVerySmallCountry = (country?.area && country.area < 1000) || smallCountryCoords[alpha3] !== undefined

  // Marker for small countries not in GeoJSON data
  const smallCountryMarker = smallCountryCoords[alpha3]

  // Track zoom level
  const minZoom = 1
  const maxZoom = config.zoom * 3
  const [currentZoom, setCurrentZoom] = useState(config.zoom)

  // Calculate zoom percentage (0-100)
  const zoomPercentage = ((currentZoom - minZoom) / (maxZoom - minZoom)) * 100

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Info card - absolute on desktop, relative on mobile */}
      {country && (
        <div className="md:absolute md:top-4 md:left-1/2 md:-translate-x-1/2 md:z-20 mb-4 md:mb-0 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200 p-3 md:px-6 md:py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-6">
            <img
              src={getFlagUrl(countryCode, 'large')}
              alt=""
              className="w-16 h-10 md:w-20 md:h-12 object-cover rounded-lg shadow-md border border-gray-200 flex-shrink-0"
            />
            {/* Mobile: 2 rows, Desktop: 1 row */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              {/* Capital and population */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Hovedstad</p>
                  <p className="text-sm md:text-base font-bold text-gray-900">
                    {country.capital}
                  </p>
                </div>
                {country.population && (
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Befolkning</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {country.population.toLocaleString('nb-NO')}
                    </p>
                  </div>
                )}
              </div>
              {/* Area and government */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-6">
                {country.area && (
                  <div className="flex flex-col">
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Areal</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">
                      {country.area.toLocaleString('nb-NO')} km²
                    </p>
                  </div>
                )}
                {country.government && (
                  <div className="flex flex-col">
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Styresett</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">
                      {country.government}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom indicator - hidden on mobile */}
      <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-3 flex-col items-center gap-3">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Zoom</span>
        <div className="relative h-40 w-4 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-primary"
            style={{ height: `${zoomPercentage}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-900">
          {Math.round(zoomPercentage)}%
        </span>
      </div>

      {/* Map container */}
      <div className="w-full bg-card rounded-lg border border-border overflow-hidden min-h-[250px] md:min-h-[400px] lg:min-h-[500px] touch-manipulation">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150,
          }}
        >
          <ZoomableGroup
            center={config.center}
            zoom={config.zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            translateExtent={[
              [-650, -400],
              [900, 600]
            ]}
            onMove={(position) => setCurrentZoom(position.zoom)}
          >
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

            {/* Red marker for small countries not in GeoJSON */}
            {smallCountryMarker && (
              <Marker coordinates={smallCountryMarker}>
                <circle r={0.1} fill="#ef4444" />
              </Marker>
            )}

            {/* White dot marker at capital location - only for larger countries */}
            {country?.capitalCoordinates && !isVerySmallCountry && (
              <Marker coordinates={country.capitalCoordinates}>
                <circle r={0.6} fill="#ffffff" />
              </Marker>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  )
}
