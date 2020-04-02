class Submissions {
  selector = '.submissions';
  active = [];
  data = {};

  constructor(app, data) {
    this.app = app;
    this.data = data;
  }

  cleanActive = () => {
    this.active = [];
  };

  getEntriesByKeys = keys => {
    const { place } = this.app.options;
    return keys
      .map(key => ({
        id: key,
        isActive: this.active.includes(key),
        ...this.data[key]
      }))
      .sort((a, b) => {
        if (a.scores[place] < b.scores[place]) {
          return 1;
        } else if (a.scores[place] > b.scores[place]) {
          return -1;
        }

        return 0;
      });
  };

  getFilteredKeysByPlace = () => {
    const { place } = this.app.options;
    return Object.keys(this.data).filter(key => this.data[key].scores[place]);
  };

  getSubmissionEntriesToTrace = () => {
    const submissions = [];

    if (this.active.length) {
      submissions.push(...this.active);
    } else {
      submissions.push(
        ...this.getFilteredKeysByPlace().slice(0, 3)
      );
    }

    return this.getEntriesByKeys(submissions);
  }

  render = () => {
    const entries = this.getEntriesByKeys(this.getFilteredKeysByPlace()).slice(
      0,
      5
    );
    const container = document.querySelector(this.selector);

    // Cleanup listeners
    this.removeListenersFromLeaderboard();

    container.innerHTML = '';

    const disableKeys = ['id', 'isActive', 'color'];


    entries.forEach((entry, index, arr) => {
      const dataKeys = Object.keys(entry).filter(
        key => typeof entry[key] !== 'object' && !disableKeys.includes(key)
      );
      const isActive = this.active.includes(entry.id);
      container.innerHTML += `
        <div class="list-group-item list-group-item-action ${
          isActive ? 'active' : ''
        }" style="word-break: break-all;" data-id="${entry.id}">
          ${
            isActive
              ? `<div class="color-circle" style="background-color: ${entry.color}"></div>`
              : ''
          }
          <div class="d-flex w-100 justify-content-between">
            <p class="mb-1">${entry.id}</p>
          </div>
          ${dataKeys
            .map(
              key =>
                `<div><small><strong>${formatSnakeCase(key)}:</strong> ${
                  entry[key]
                }</small></div>`
            )
            .join('')}
        </div>
      `;
    });

    this.addListenersToLeaderboard();
  };

  handleLeaderboardElementClicked = e => {
    e.preventDefault();

    const id = e.currentTarget.getAttribute('data-id');

    if (this.active.includes(id)) {
      this.active = this.active.filter(element => element !== id);
    } else {
      this.active.push(id);
    }

    this.app.render();
  };

  getLeaderboardChildren = () =>
    Array.from(document.querySelector(this.selector).children);

  addListenersToLeaderboard = () => {
    this.getLeaderboardChildren().forEach(element =>
      element.addEventListener('click', this.handleLeaderboardElementClicked)
    );
  };

  removeListenersFromLeaderboard = () => {
    this.getLeaderboardChildren().forEach(element =>
      element.removeEventListener('click', this.handleLeaderboardElementClicked)
    );
  };
}
