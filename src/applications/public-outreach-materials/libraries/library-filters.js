const cards = document.querySelectorAll('.asset-card');
let activePage = 1;
let numCards;
let numActiveCards;
const itemsPerPage = 10;
let pages = Math.ceil(cards.length / itemsPerPage);

export function libraryNumCards() {
  const items = document.querySelectorAll(
    '.asset-card:not(.pager-hide):not(.hide-topic):not(.hide-type)',
  );
  const first = items[0] ? items[0].attributes['data-number'].value : 0;
  const last = items.length;

  return { first, last };
}

export function libraryClickAccessFocus() {
  const focusItem = document.getElementById('pager-focus');
  focusItem.focus();
}

export function libraryClickAccessTrigger() {
  const pagerClickers = document.getElementsByClassName('pager-focus-item');
  Array.prototype.slice.call(pagerClickers).forEach(element => {
    element.addEventListener('click', libraryClickAccessFocus);
  });
}

export function libraryAnchorStop(e) {
  if (e !== undefined) {
    e.preventDefault();
  }
}

export function libraryNumActiveCards() {
  return document.querySelectorAll(
    '.asset-card:not(.hide-topic):not(.hide-type)',
  ).length;
}

export function libraryCount() {
  if (document.getElementById('no-results')) {
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('va-pager-div').style.display = 'flex';
    document.getElementById('total-pages-div').style.display = 'flex';
  }

  if (document.getElementById('total-pages')) {
    numCards = libraryNumCards();
    if (document.getElementById('total-pages')) {
      const tally =
        numCards.first < 0
          ? 0
          : `${numCards.first} - ${+numCards.first + +numCards.last - 1}`;
      const srTally =
        numCards.first < 0
          ? 0
          : `${numCards.first} through ${+numCards.first + +numCards.last - 1}`;
      document.getElementById('total-pages').innerText = tally;
      document.getElementById('total-pages-sr').innerText = srTally;
    }
    numActiveCards = libraryNumActiveCards();
    document.getElementById('total-all').innerText = ` of ${numActiveCards}`;
    if (numCards.first < 1 && document.getElementById('no-results')) {
      document.getElementById('va-pager-div').style.display = 'none';
      document.getElementById('total-pages-div').style.display = 'none';
      document.getElementById('no-results').style.display = 'block';
    }
  }
}

export function libraryCurrent() {
  let increment = 1;
  let numVal;
  Array.prototype.slice.call(cards).forEach(element => {
    if (
      !element.classList.contains('hide-topic') &&
      !element.classList.contains('hide-type')
    ) {
      element.setAttribute('data-number', increment);
      if (increment % 2 !== 0) {
        element.classList.add('large-screen:vads-u-margin-right--3');
      } else {
        element.classList.remove('large-screen:vads-u-margin-right--3');
      }
      numVal = element.getAttribute('data-number');
      increment += 1;
    }
    if (
      numVal > activePage * itemsPerPage ||
      numVal <= (activePage - 1) * itemsPerPage
    ) {
      element.classList.add('pager-hide');
    } else {
      element.classList.remove('pager-hide');
    }
    if (activePage === undefined && numVal > itemsPerPage) {
      element.classList.add('pager-hide');
    }
  });
}

export function libraryPagerGen() {
  const numCardsCount = libraryNumActiveCards();
  numCards = libraryNumCards();
  pages = Math.ceil(numCardsCount / itemsPerPage);
  if (document.getElementById('pager-nums-insert')) {
    const diff = pages - activePage;
    let pagerHtml;
    // This is our active page / pager button.
    pagerHtml = `<a href="#${activePage}" aria-label="Page ${activePage}" aria-current="true" id="va-pagination-active-num" class="va-pagination-active a-page-numbers pager-focus-item">
    ${activePage}</a>`;
    // If we have more than one page, add a button in front of active button
    if (diff >= 1) {
      pagerHtml += `<a href="#${activePage + 1}" aria-label="Page ${activePage +
        1}" class="pager-numbers pager-focus-item" aria-label="Load page
      ${activePage + 1}">${activePage + 1}</a>`;
    }
    // If we have more than two pages, add second page
    // button in front of active button.
    if (diff >= 2) {
      pagerHtml += `<a href="#${activePage + 2}" aria-label="Page ${activePage +
        2}" class="pager-numbers pager-focus-item" aria-label="Load page
      ${activePage + 2}">${activePage + 2}</a>`;
    }
    // If we have more than three pages, add a third button and ellipses to
    // link to last page.
    if (diff >= 3) {
      pagerHtml += `.... <a href="#${pages}" aria-label="Page ${pages}" class="pager-numbers pager-focus-item" aria-label="Load page
      ${pages}"> ${pages}</a>`;
    }
    document.getElementById('pager-nums-insert').innerHTML = pagerHtml;

    // Prevent 508 compliant anchor links from making page jump
    const pagingAnchors = document.querySelectorAll('.va-button-link');
    if (pagingAnchors) {
      Array.prototype.slice.call(pagingAnchors).forEach(element => {
        element.addEventListener('click', libraryAnchorStop);
      });
    }
  }
}

export function libraryReset() {
  libraryPagerGen();
  libraryCurrent();
  libraryCount();
  libraryClickAccessTrigger();
}

export function libraryFilters(el) {
  // Grab our current page from the active pager button.
  if (el.srcElement.classList.contains('pager-numbers')) {
    activePage = parseInt(el.srcElement.text, 10);
    sessionStorage.setItem('pageNum', parseInt(el.srcElement.text, 10));
  }
  // Move our page forward when button clicked if we have more than one page.
  if (
    el.srcElement.id === 'pager-next-click' &&
    activePage !== pages &&
    (numCards.last === undefined || numCards.last > 9)
  ) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', (activePage += 1));
  }
  // Move our page backward when button clicked if we aren't on page one.
  if (el.srcElement.id === 'pager-previous-click' && activePage !== 1) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', (activePage -= 1));
  }
  // Go back to page one regardless of page number.
  if (el.srcElement.id === 'first-click') {
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
  }
  // Go to last page regardless of page number.
  if (
    el.srcElement.id === 'last-click' &&
    (numCards.last === undefined || numCards.last > 9)
  ) {
    activePage = pages;
    sessionStorage.setItem('pageNum', activePage);
  }

  // Determine which filter the user is changing for selection.
  const selectSwitch = el.srcElement.id === 'outreach-type' ? 'type' : 'topic';

  if (
    el.srcElement.value &&
    el.srcElement.value.length &&
    el.srcElement.value !== 'select'
  ) {
    // We always go back to page one when filter is selected to prevent
    // paging conflict with filtered results.
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
    // Show only filter match and hide the rest.
    [].map.call(
      document.querySelectorAll(
        `[data-${selectSwitch}]:not([data-${selectSwitch}
          *=${el.srcElement.value}])`,
      ),
      element => {
        element.classList.add(`hide-${selectSwitch}`);
      },
    );
    [].map.call(
      document.querySelectorAll(
        `[data-${selectSwitch}*=${el.srcElement.value}]`,
      ),
      element => {
        element.classList.remove(`hide-${selectSwitch}`);
      },
    );
    Array.prototype.slice.call(cards).forEach(element => {
      element.classList.remove('pager-hide');
    });
  } else if (el.srcElement.value === 'select') {
    // If the user clicks the default select, reset the results to show all.
    [].map.call(
      document.querySelectorAll(`[data-${selectSwitch}]`),
      element => {
        element.classList.remove(`hide-${selectSwitch}`);
      },
    );
  }
  libraryReset();
}

export function libraryListeners() {
  const typeItem = document.getElementById('outreach-type');
  const topicItem = document.getElementById('outreach-topic');
  const pagingEl = document.querySelector('.va-pagination');
  const reLoad = document.getElementById('start-over');
  if (reLoad) {
    reLoad.addEventListener('click', () => {
      window.location.reload();
    });
  }
  if (document.getElementById('total-pages')) {
    document.getElementById('total-pages').innerText = cards.length;
  }
  if (pagingEl) {
    pagingEl.addEventListener('click', libraryFilters);
  }
  if (topicItem) {
    topicItem.addEventListener('change', libraryFilters);
  }
  if (typeItem) {
    typeItem.addEventListener('change', libraryFilters);
  }
  libraryReset();
}
