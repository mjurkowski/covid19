const csv = strData => {
  const strDelimiter = ",";

  // Create a regular expression to parse the CSV values.
  const objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  const arrData = [[]];
  let arrMatches = null;

  while (arrMatches = objPattern.exec(strData)) {
    var strMatchedDelimiter = arrMatches[1];
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ) {
      arrData.push([]);
    }

    var strMatchedValue;

    if (arrMatches[2]) {

      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );

    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  return arrData;
}

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
      places: globalDeaths.map(r => r[0] === 'WORLD' ? 'World' : r[0]).slice(1).sort().filter((r, index, arr) => arr.indexOf(r) === index)
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
      isActive: data.activeLeaderboard.includes(key),
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

const getOptions = () => {
  const placeInput = document.querySelector(selectors.placeInput);
  const placeOption = placeInput.options[placeInput.selectedIndex];
  return {
    place: placeOption ? placeOption.value : defaultSelectedPlace,
    log: document.querySelector(selectors.logOptionInput).checked,
    dydx: document.querySelector(selectors.dydxOptionInput).checked
  }
}

const colorway = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b, #e377c2', '#7f7f7f', '#bcbd22', '#17becf']

