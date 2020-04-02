class Chart {
  selector = '#chart';

  constructor(app, submissions) {
    this.app = app;
    this.submissions = submissions;
  }

  getChartTraces = () => {
    const { place, dydx } = this.app.options;

    const predictions = this.submissions
      .getSubmissionEntriesToTrace()
      .map(entry => {
        const filteredPredictions = entry.predictions.filter(
          r => r[2] === place
        );
        return {
          x: filteredPredictions.map(r => new Date(r[0])),
          y: filteredPredictions.map(r => parseFloat(r[1])),
          name: entry.id,
          line: {
            color: entry.color,
            dash: 'dot',
            width: 2
          }
        };
      });

    const result = [
      ...predictions,
      {
        x: this.app.data.globalDeaths.dates,
        y: this.app.data.globalDeaths.locations[place].data,
        name: 'WHO Report',
        mode: 'lines+markers',
        line: {
          color: '#000000'
        }
      }
    ];

    if (dydx) {
      return this.getDyDxTraces(result);
    }

    return result;
  };

  getDyDxTraces = (traces = []) => {
    return traces.map(trace => ({
      ...trace,
      y: trace.y.reduce((acc, y, index, arr) => {
        const nextValue = arr[index + 1];
        if (!!nextValue) {
          acc.push(arr[index + 1] - y);
        }
        return acc;
      }, [])
    }));
  };

  render = () => {
    const chartContainer = document.querySelector(this.selector);

    const data = this.getChartTraces();

    const { log } = this.app.options;

    const layout = {
      showlegend: true,
      legend: {
        orientation: 'h'
      },
      margin: { t: 0 },
      ...(log
        ? {
            yaxis: {
              type: 'log',
              autorange: true
            }
          }
        : {})
    };

    const options = {
      scrollZoom: true,
      responsive: true
    };

    Plotly.newPlot(chartContainer, data, layout, options);
  };
}
