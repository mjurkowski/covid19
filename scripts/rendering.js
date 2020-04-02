const render = () => {
  renderLeaderboard();
  plotChat();
}

const renderLeaderboard = () => {
  const entries = getLeaderboardEntries(getFilteredByPlaceLeaderborardsKeys()).slice(0, 5);
  const container = document.querySelector(selectors.leaderboard);

  // Cleanup listeners
  removeListenersToLeaderboard();

  container.innerHTML = '';

  const disableKeys = ['id', 'isActive']

  const activeKeys = entries.filter(e => e.isActive).map(e => e.id);

  entries.forEach((entry, index, arr) => {
    const dataKeys = Object.keys(entry).filter(key => typeof entry[key] !== 'object' && !disableKeys.includes(key));
    const isActive = data.activeLeaderboard.includes(entry.id);
    const color = isActive && colorway[activeKeys.indexOf(entry.id)];
    container.innerHTML += `
      <div class="list-group-item list-group-item-action ${isActive ? 'active' : ''}" data-id="${entry.id}">
        ${isActive ? `<div class="color-circle" style="background-color: ${color}"></div>` : ''}
        <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">${entry.id}</p>
        </div>
        ${dataKeys.map(key => `<div><small><strong>${formatSnakeCase(key)}:</strong> ${entry[key]}</small></div>`).join('')}
      </div>
    `
  })

  addListenersToLeaderboard();
}

const renderPlaces = () => {
  const { places } = data;
  const selected = getOptions().place
  const container = document.querySelector(selectors.placeInput);
  container.innerHTML = '';

  places.forEach(place => {
    container.innerHTML += `
      <option value="${place}" ${place === selected ? 'selected' : ''}>${place}</option>
    `
  })
}
