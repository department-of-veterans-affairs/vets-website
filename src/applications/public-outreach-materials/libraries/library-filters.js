const cards = document.querySelectorAll('.asset-card');
let activePage = 1;
let numCards;
let numActiveCards;
const itemsPerPage = 10;
let pages = Math.ceil(cards.length / itemsPerPage);

export function libraryNumCards() {
  return document.querySelectorAll(
    '.asset-card:not(.pager-hide):not(.hide-topic):not(.hide-type)',
  ).length;
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
  }

  if (document.getElementById('total-pages')) {
    numCards = libraryNumCards();
    if (document.getElementById('total-pages')) {
      document.getElementById('total-pages').innerText =
        numCards < 0 ? 0 : numCards;
    }
    numActiveCards = libraryNumActiveCards();
    document.getElementById('total-all').innerText = ` of ${numActiveCards}`;
    if (numCards < 1 && document.getElementById('no-results')) {
      document.getElementById('va-pager-div').style.display = 'none';
      document.getElementById('no-results').style.display = 'block';
    }
  }
}

export function libraryCurrent() {
  let increment = 1;
  let numVal;
  cards.forEach(element => {
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
      increment++;
    }
    if (
      numVal > activePage * itemsPerPage ||
      numVal <= (activePage - 1) * itemsPerPage
    ) {
      element.classList.add('pager-hide');
    } else {
      element.classList.remove('pager-hide');
    }
    if (activePage === undefined) {
      if (numVal > itemsPerPage) {
        element.classList.add('pager-hide');
      }
    }
  });
}

export function libraryPagerGen() {
  numCards = libraryNumActiveCards();
  pages = Math.ceil(numCards / itemsPerPage);
  if (document.getElementById('pager-nums-insert')) {
    const diff = pages - activePage;
    let pagerHtml;
    // This is our active page / pager button.
    pagerHtml = `<button id="va-pagination-active-num" class="va-page-numbers">
    ${activePage}</button>`;
    // If we have more than one page, add a button in front of active button.
    if (diff > 1 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `<a class="pager-numbers" aria-label="Load page
      ${activePage + 1}">${activePage + 1}</a>`;
    }
    // If we have more than two pages, add second page
    // button in front of active button.
    if (diff > 2 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `<a class="pager-numbers" aria-label="Load page
      ${activePage + 2}">${activePage + 2}</a>`;
    }
    // If we have more than three pages, add a third button and ellipses to
    // link to last page.
    if (diff > 3 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `.... <a class="pager-numbers" aria-label="Load page
      ${pages}"> ${pages}</a>`;
    }
    document.getElementById('pager-nums-insert').innerHTML = pagerHtml;
  }
}

export function libraryReset() {
  libraryPagerGen();
  libraryCurrent();
  libraryCount();
}

export function libraryFilters(el) {
  // Grab our current page from the active pager button.
  if (el.srcElement.className === 'pager-numbers') {
    activePage = parseInt(el.srcElement.text, 10);
    sessionStorage.setItem('pageNum', parseInt(el.srcElement.text, 10));
  }
  // Move our page forward when button clicked if we have more than one page.
  if (
    el.srcElement.id === 'pager-next-click' &&
    activePage !== pages &&
    (numCards === undefined || numCards > 9)
  ) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', activePage++);
  }
  // Move our page backward when button clicked if we aren't on page one.
  if (el.srcElement.id === 'pager-previous-click' && activePage !== 1) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', activePage--);
  }
  // Go back to page one regardless of page number.
  if (el.srcElement.id === 'first-click') {
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
  }
  // Go to last page regardless of page number.
  if (
    el.srcElement.id === 'last-click' &&
    (numCards === undefined || numCards > 9)
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
          =${el.srcElement.value}])`,
      ),
      element => {
        element.classList.add(`hide-${selectSwitch}`);
      },
    );
    [].map.call(
      document.querySelectorAll(
        `[data-${selectSwitch}=${el.srcElement.value}]`,
      ),
      element => {
        element.classList.remove(`hide-${selectSwitch}`);
      },
    );
    cards.forEach(element => {
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
