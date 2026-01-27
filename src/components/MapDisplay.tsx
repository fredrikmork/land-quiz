import { useState, useMemo, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import isoCountries from 'i18n-iso-countries'
import { countries as quizCountries } from '../data/countries'
import {
  GEO_URL,
  getAlpha3,
  alpha3ToNumeric,
  smallCountryCoords,
  zoomConfig,
  numericToAlpha2,
} from '../data/mapConfig'

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
              <circle r={0.75} fill="#ef4444" stroke="#ef4444" strokeWidth={0.125} />
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

interface InteractiveMapDisplayProps {
  selectedAnswer: string | null
  correctAnswer: string
  answered: boolean
  onSelect: (countryCode: string) => void
}

export function InteractiveMapDisplay({
  selectedAnswer,
  correctAnswer,
  answered,
  onSelect,
}: InteractiveMapDisplayProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  // Set of valid quiz country codes
  const validCountryCodes = useMemo(() => new Set(quizCountries.map(c => c.code)), [])

  const correctAlpha3 = getAlpha3(correctAnswer)
  const correctNumeric = alpha3ToNumeric[correctAlpha3]
  const selectedNumeric = selectedAnswer ? alpha3ToNumeric[getAlpha3(selectedAnswer)] : null

  // Start with world view, user can zoom/pan to find the country
  const config = { center: [0, 20] as [number, number], zoom: 1.5 }

  const getCountryFill = useCallback((numericId: string, isValidQuizCountry: boolean) => {
    if (answered) {
      if (numericId === correctNumeric) return '#22c55e' // Green for correct
      if (numericId === selectedNumeric) return '#ef4444' // Red for wrong selection
    }
    // Slightly darker gray for non-quiz areas (like Antarctica)
    return isValidQuizCountry ? '#d1d5db' : '#c0c5cb'
  }, [answered, correctNumeric, selectedNumeric])

  const getCountryStroke = useCallback((numericId: string) => {
    if (answered) {
      if (numericId === correctNumeric) return '#22c55e' // Green stroke for correct
      if (numericId === selectedNumeric) return '#ef4444' // Red stroke for wrong
    }
    return '#9ca3af'
  }, [answered, correctNumeric, selectedNumeric])

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden min-h-[250px] md:min-h-[400px] lg:min-h-[500px] touch-manipulation">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
        }}
      >
        <ZoomableGroup center={config.center} zoom={config.zoom} minZoom={1} maxZoom={12}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoId = geo.id?.toString()
                const alpha2 = numericToAlpha2[geoId || '']
                const isValidQuizCountry = alpha2 ? validCountryCodes.has(alpha2) : false
                const fill = getCountryFill(geoId || '', isValidQuizCountry)
                const stroke = getCountryStroke(geoId || '')
                const isHighlighted = answered && (geoId === correctNumeric || geoId === selectedNumeric)
                const isClickable = !answered && isValidQuizCountry

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (isClickable) {
                        onSelect(alpha2)
                      }
                    }}
                    style={{
                      default: {
                        fill,
                        stroke,
                        strokeWidth: isHighlighted ? 1.5 : 0.5,
                        outline: 'none',
                        cursor: isClickable ? 'pointer' : 'default',
                      },
                      hover: {
                        fill: isClickable ? '#93c5fd' : fill,
                        stroke: isClickable ? '#93c5fd' : stroke,
                        strokeWidth: isClickable ? 1 : (isHighlighted ? 1.5 : 0.5),
                        outline: 'none',
                        cursor: isClickable ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isClickable ? '#3b82f6' : fill,
                        stroke: isClickable ? '#3b82f6' : stroke,
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
          {/* Show markers for small isoCountries */}
          {Object.entries(smallCountryCoords).map(([alpha3, coords]) => {
            const alpha2 = isoCountries.alpha3ToAlpha2(alpha3) || (alpha3 === 'XKX' ? 'XK' : alpha3)
            const isCorrect = alpha2 === correctAnswer
            const isSelected = alpha2 === selectedAnswer
            const isHovered = hoveredMarker === alpha3

            let fill = '#d1d5db' // Default gray
            let stroke = '#9ca3af'
            if (answered) {
              if (isCorrect) {
                fill = '#22c55e'
                stroke = '#22c55e'
              } else if (isSelected) {
                fill = '#ef4444'
                stroke = '#ef4444'
              }
            } else if (isHovered) {
              fill = '#93c5fd' // Light blue on hover
              stroke = '#93c5fd'
            }

            const countryName = quizCountries.find(c => c.code === alpha2)?.name || alpha2

            return (
              <Marker key={alpha3} coordinates={coords}>
                <circle
                  r={0.75}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isHovered && !answered ? 0.25 : 0.125}
                  style={{ cursor: !answered ? 'pointer' : 'default' }}
                  role={!answered ? 'button' : undefined}
                  tabIndex={!answered ? 0 : -1}
                  aria-label={!answered ? `Velg ${countryName}` : countryName}
                  onMouseEnter={() => !answered && setHoveredMarker(alpha3)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => {
                    if (!answered) {
                      onSelect(alpha2)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!answered && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onSelect(alpha2)
                    }
                  }}
                />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
