

<GaugeChart id="gauge-chart3" 
  nrOfLevels={30} 
  colors={["#FF5F6D", "#FFC371"]} 
  arcWidth={0.3} 
  percent={0.37} //We get this from the real time database having water level
  alert={0.1* apartment.threshold}
/>
