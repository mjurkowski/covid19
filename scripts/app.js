const selectors = {
  leaderboard: '.leaderboard',
  placeInput: '#place',
  logOptionInput: '#logOption',
  dydxOptionInput: '#dydxOption',
  chart: '#chart'
}

let data = {
  leaderboard: {},
  places: [],
  globalDeaths: [],
  activeLeaderboard: []
}

const defaultSelectedPlace = 'World';

(async () => {
  const newData = await loadAllData();

  data = {
    ...data,
    ...newData
  };

  attachActions();
  renderPlaces();
  render();
})();

