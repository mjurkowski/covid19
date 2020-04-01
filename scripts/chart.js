const getChartTraces = () => {
  const leaderboard = [];
  const { place } = getOptions();

  if (data.activeLeaderboard.length) {
    leaderboard.push(...data.activeLeaderboard);
  } else {
    leaderboard.push(...getFilteredByPlaceLeaderborardsKeys().slice(0, 3))
  }

  const predictions = getLeaderboardEntries(leaderboard).map(entry => {
    const filteredPredictions = entry.predictions.filter(r => r[2] === place)
    return {
      x: filteredPredictions.map(r => new Date(r[0])),
      y: filteredPredictions.map(r => parseFloat(r[1])),
      name: entry.id
    }
  });

  return [
    ...predictions,
    {
      x: data.globalDeaths[0].slice(3).map(r => new Date(r)),
      y: data.globalDeaths.find(r => r[0] === place).slice(3).map(r => parseFloat(r)),
      name: 'WHO Report'
    }
  ]
}


const plotChat = () => {
  const chartContainer = document.querySelector(selectors.chart);

  const data = getChartTraces();

  const opts = getOptions();

  const layout = {
    showlegend: true,
    legend: {
      orientation: 'h',
    },
    margin: { t: 0 },
    ...(opts.log ? {
      yaxis: {
        type: 'log',
        autorange: true
      }
    } : {})
  };

  const options = {
    scrollZoom: true,
    responsive: true
  }

  Plotly.newPlot( chartContainer, data, layout, options );
}
