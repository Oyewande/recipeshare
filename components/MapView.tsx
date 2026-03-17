"use client"

import { ComposableMap, Geographies, Geography } from "react-simple-maps"

interface MapViewProps {
  onCountrySelect?: (country: string) => void
  selectedCountry?: string | null
}

export default function MapView({ onCountrySelect, selectedCountry }: MapViewProps) {

  return (

    <ComposableMap>

      <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">

        {({ geographies }) =>
          geographies.map((geo) => {
            const countryName = geo.properties.name;
            const isSelected = selectedCountry === countryName;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onCountrySelect && onCountrySelect(countryName)}
                className={`transition-colors cursor-pointer outline-none ${
                  isSelected ? "fill-hunter-green" : "fill-gray-300 hover:fill-sage-green"
                }`}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            )
          })
        }

      </Geographies>

    </ComposableMap>

  )
}