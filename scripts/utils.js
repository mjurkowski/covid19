const csv = text => text.split('\n').map(line => line.split(','));

const formatSnakeCase = text => {
  let formattedText = text.replace(/_/g, ' ');
  return formattedText[0].toUpperCase() + formattedText.substr(1);
}

const loadAllData = () => Promise.all([
  fetch('./leaderboard.json').then(response => response.json()),
  fetch('./time_series_covid19_deaths_global.csv').then(response => response.text()).then(csv)
]).then(([leaderboard, globalDeaths]) => {
  return Promise.all(
    Object.keys(leaderboard)
      .map(key => 
        fetch(`./predictions_challenge/${key}/predictions.csv`)
          .then(response => response.text())
          .then(csv)
      )
  ).then(responses => {
    Object.keys(leaderboard).forEach((key, index) => {
      leaderboard[key].predictions = responses[index].splice(1);
    })

    return {
      leaderboard,
      globalDeaths: globalDeaths.map(r => r[0] === 'WORLD' ? ['World', ...r.slice(1)] : r),
      places: globalDeaths.map(r => r[0] === 'WORLD' ? 'World' : r[0]).slice(1).sort()
    }
  })
});

const getLeaderboardChildren = () => Array.from(document.querySelector(selectors.leaderboard).children)

const getFilteredByPlaceLeaderborardsKeys = () => {
  const { place } = getOptions();
  return Object.keys(data.leaderboard)
    .filter(key => data.leaderboard[key].scores[place])
}

const getLeaderboardEntries = (leaderboardKeys) => {
  const { place } = getOptions();
  return leaderboardKeys
    .map(key => ({
      id: key,
      ...data.leaderboard[key]
    }))
    .sort((a, b) => {
      if (a.scores[place] < b.scores[place]) {
        return 1;
      } else if (a.scores[place] > b.scores[place]) {
        return -1;
      }

      return 0;
    })
}

const render = () => {
  renderLeaderboard();
  plotChat();
}

const getOptions = () => {
  const placeInput = document.querySelector(selectors.placeInput);
  const placeOption = placeInput.options[placeInput.selectedIndex];
  return {
    place: placeOption ? placeOption.value : defaultSelectedPlace,
    log: document.querySelector(selectors.logOptionInput).checked,
    dydx: document.querySelector(selectors.dydxOptionInput).checked
  }
}
