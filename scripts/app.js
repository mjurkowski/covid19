class App {
  data = {
    places: [],
    globalDeaths: []
  };
  defaultSelectedPlace = 'World';
  selectors = {
    placeInput: '#place',
    logOptionInput: '#logOption',
    dydxOptionInput: '#dydxOption'
  };
  colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b', 
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf'
  ];

  constructor() {
    this.init();
  }

  init = async () => {
    this.attachActions();

    const data = await this.loadAllData();

    this.data.places = data.places;
    this.data.globalDeaths = data.globalDeaths;

    this.submissions = new Submissions(this, data.submissions);
    this.chart = new Chart(this, this.submissions);

    this.renderPlaces();
    this.render();
  };

  loadAllData = () =>
    Promise.all([
      fetch('./leaderboard.json').then(response => response.json()),
      fetch('./time_series_covid19_deaths_global.csv')
        .then(response => response.text())
        .then(csv)
    ]).then(([submissions, globalDeaths]) => {
      return Promise.all(
        Object.keys(submissions).map(key =>
          fetch(`./predictions_challenge/${key}/predictions.csv`)
            .then(response => response.text())
            .then(csv)
        )
      ).then(responses => {
        Object.keys(submissions).forEach((key, index) => {
          submissions[key].color = this.colors[index];
          submissions[key].predictions = responses[index].splice(1);
        });

        return {
          submissions,
          globalDeaths: globalDeaths.map(r =>
            r[0] === 'WORLD' ? ['World', ...r.slice(1)] : r
          ),
          places: globalDeaths
            .map(r => (r[0] === 'WORLD' ? 'World' : r[0]))
            .slice(1)
            .sort()
            .filter((r, index, arr) => arr.indexOf(r) === index)
        };
      });
    });

  renderPlaces = () => {
    const selected = this.options.place;
    const container = document.querySelector(this.selectors.placeInput);
    container.innerHTML = '';

    this.data.places.forEach(place => {
      container.innerHTML += `
        <option value="${place}" ${
        place === selected ? 'selected' : ''
      }>${place}</option>
      `;
    });
  };

  attachActions = () => {
    document
      .querySelector(this.selectors.placeInput)
      .addEventListener('change', this.handlePlaceChanged);
    document
      .querySelector(this.selectors.logOptionInput)
      .addEventListener('change', this.render);
    document
      .querySelector(this.selectors.dydxOptionInput)
      .addEventListener('change', this.render);
  };

  handlePlaceChanged = () => {
    this.submissions.cleanActive();
    this.render();
  };

  render = () => {
    this.submissions.render();
    this.chart.render();
  };

  get options() {
    const placeInput = document.querySelector(this.selectors.placeInput);
    const placeOption = placeInput.options[placeInput.selectedIndex];
    return {
      place: placeOption ? placeOption.value : this.defaultSelectedPlace,
      log: document.querySelector(this.selectors.logOptionInput).checked,
      dydx: document.querySelector(this.selectors.dydxOptionInput).checked
    };
  }
}

new App();
