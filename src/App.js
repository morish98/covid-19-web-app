import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./InfoBox.css";

function App() {
  
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoading, setLoading] = useState(false);

  // TO GET ALL THE DATA AND DISPLAY THE WORLWIDE DATA BY DEFAILT

  useEffect(() => {
  const getCountryInfo = async() => {
    await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    };
    getCountryInfo();
  }, []);

  // TO GET ALL THE COUNTRY DATA AND TO USE IT ACCORDINGLY

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  // TO SHOW A PARTICULAR COUNTRY DATA ON SELECTING THAT PARTICULAR COUNTRY
  
  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        countryCode === "worldwide"
          ? setMapCenter([20.5937, 78.9629])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoom(4);
      });
  };

  return (

    // CONTAINING TOTAL WEBPAGE STRUCTURE

    <div className="app">

      {/* LEFT SIDE CONTENT OF THE WEBPAGE */}

      <div className="app__left">

        {/* HEADING AND DROPDOWN MENU */}

        <div className="app__header">
          <h1>Covid-19 Tracker</h1>

          {/* DROPDOWN CONTAINING ALL THE COUNTRY */}

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* INFOBOXES CONTAINING THE TOTAL CASES, RECOVERED AND DEATHS DATA */}

        <div className="app__stats">

          {/* TOTAL CASES */}
        
          <InfoBox
            isRed
            active={casesType === "cases"}
            className="infoBox__cases"
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
            isloading={isLoading}
          />
        
          {/* TOTAL RECOVERED */}

          <InfoBox
            active={casesType === "recovered"}
            className="infoBox__recovered"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            isloading={isLoading}
          />
          
          {/* TOTAL DEATHS */}

          <InfoBox
            isGrey
            active={casesType === "deaths"}
            className="infoBox__deaths"
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            isloading={isLoading}
          />
        </div>

        {/* MAP */}
        
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}
          casesType={casesType}
        />

      </div>
      
      {/* RIGHT SIDE CONTENT OF THE WEBPAGE */}

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
      
          {/* TABLE */} 
      
          <Table countries={tableData} />
          <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
      
          {/* GRAPH */}
      
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
