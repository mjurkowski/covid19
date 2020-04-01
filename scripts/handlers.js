const addListenersToLeaderboard = () => {
  getLeaderboardChildren().forEach(element => element.addEventListener('click', handleLeaderboardElementClicked))
}

const removeListenersToLeaderboard = () => {
  getLeaderboardChildren().forEach(element => element.removeEventListener('click', handleLeaderboardElementClicked))
}

const handleLeaderboardElementClicked = e => {
  e.preventDefault();

  const id = e.currentTarget.getAttribute('data-id');

  if (data.activeLeaderboard.includes(id)) {
    data.activeLeaderboard = data.activeLeaderboard.filter(element => element !== id);
  } else {
    data.activeLeaderboard.push(id);
  }

  render();
}

const attachActions = () => {
  document.querySelector(selectors.placeInput).addEventListener('change', handlePlaceChanged)
  document.querySelector(selectors.logOptionInput).addEventListener('change', render)
  document.querySelector(selectors.dydxOptionInput).addEventListener('change', render)
}

const handlePlaceChanged = () => {
  data.activeLeaderboard = [];
  render();
}
