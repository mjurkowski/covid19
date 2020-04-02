class Map {
  selectors = {
    map: '#map',
    range: '#mapIndexSelector',
    header: '.map-navigation h3',
    btn: '.map-navigation #play'
  }

  index = 0
  interval = null

  constructor(app) {
    this.app = app;

    this.initialRender();

    this.render();
  }

  initialRender = () => {
    const { dates } = this.app.data.globalDeaths;
    const input = document.querySelector(this.selectors.range);
    input.setAttribute('min', 0)
    input.setAttribute('max', dates.length)
    input.addEventListener('change', this.handleRangeChange)
    document.querySelector(this.selectors.btn).addEventListener('click', this.handleBtnClicked);
  }

  formatDate(date) {
    return date.toLocaleDateString()
  }

  handleBtnClicked = (e) => {
    e.preventDefault();

    if(this.interval) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.interval = setInterval(this.handleInterval, 1000);
    document.querySelector(this.selectors.btn).innerText = 'Pause';
  }

  pause() {
    clearInterval(this.interval)
    this.interval = null;
    document.querySelector(this.selectors.btn).innerText = 'Play';
  }

  handleInterval = () => {
    this.index += 1;

    const { dates } = this.app.data.globalDeaths;
    if(this.index >= dates.length) {
      this.index = 0;
    }

    this.render();
  }

  handleRangeChange = (e) => {
    this.index = parseInt(e.target.value);
    this.render()
  }

  render() {
    const { locations, dates } = this.app.data.globalDeaths;

    const input = document.querySelector(this.selectors.range);
    input.setAttribute('value', this.index);

    document.querySelector(this.selectors.header).innerText = this.formatDate(dates[this.index]);

    const places = Object.keys(locations).filter(p => p !== 'World');
    const maxSize = Math.max(...places.map(place => Math.max(...locations[place].data)))
    const data = places.map(place => {
      const value = locations[place].data[this.index];

      if(!value) {
        return null;
      }

      return {
        type: 'scattermapbox',
        name: place,
        text: `${value} deaths`,
        lon: [locations[place].lon],
        lat: [locations[place].lat],
        marker: { sizemin: 10, size: [ 200 * value / maxSize] }
      }
    }).filter(Boolean);

    const container = document.querySelector(this.selectors.map);

    const layout = {
      dragmode: 'zoom',
      mapbox: {
        style: 'open-street-map',
        zoom: 1
      },
      margin: { r: 0, t: 0, b: 0, l: 0 }
    };

    const config = {
      mapboxAccessToken: 'pk.eyJ1IjoibWp1cmtvd3NraSIsImEiOiJjazhqNndyN3IwMzdoM21zbWNvd2IxOXhmIn0.QNTjswTOs1kJwNx0a9RJpQ'
    }

    Plotly.newPlot('map', data, layout, config);
  }
}
