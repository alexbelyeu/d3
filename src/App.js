// React Grid Layout: https://github.com/STRML/react-grid-layout
// Recharts: https://github.com/recharts/recharts http://recharts.org/en-US/api
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import ScatterPlot from './components/ScatterPlot';
import Histogram from './components/Histogram';
import netflixData from './data/netflix_shows.csv';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv(netflixData).then((data) => {
      const filteredData = data.filter((d) => !isNaN(d.userRatingScore));
      setData(filteredData);
    });
  }, []);

  return (
    <div>
      {/* <div className="max-w-md mx-auto flex p-6 bg-gray-100 mt-10 rounded-lg shadow-xl">
        <div className="ml-6 pt-1">
          <h1 className="text-2xl text-blue-700 leading-tight">
            Tailwind and Create React App
          </h1>
          <p className="text-base text-gray-700 leading-normal">
            Building apps together
          </p>
        </div>
      </div> */}
      <div className="my-4 card" key={0}>
        {data.length > 0 && <ScatterPlot id={0} width={1000} dataset={data} />}
      </div>
      <div className="card" key={1}>
        {data.length > 0 && <Histogram id={1} width={1000} dataset={data} />}
      </div>
    </div>
  );
};

export default App;
