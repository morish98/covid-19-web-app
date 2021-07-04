import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

// COLOR TYPES FOR DIFFERENT CASES

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    mulitiplier: 800,
  },

  recovered: {
    hex: "#7DD71D",
    mulitiplier: 1200,
  },

  deaths: {
    hex: "rgb(95, 94, 94)",
    mulitiplier: 1000,
  },
};

// SORT THE COUNTRY ACCORDING TO TOTAL CASES

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => b.cases - a.cases);

  return sortedData;
};

// TO CHANGE THE NUMBER FORMAT

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0 a")}` : "+0";

// DRAW CIRCLES ON THE MAP

export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={
        Math.sqrt(country[casesType] / 10) *
        casesTypeColors[casesType].mulitiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
