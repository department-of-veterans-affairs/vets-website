const cards = document.querySelectorAll('.asset-card');
let activePage = 1;
let numCards;
const benefit = 'benefit';
const events = 'events';
const pages = Math.ceil(cards.length / 10);

export function libraryGetQParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.getAll('q');
  return currentPage[0];
}

export function libraryNumCards() {
  return document.querySelectorAll(
    '.asset-card:not(.pager-hide):not(.hide-topic):not(.hide-type)',
  ).length;
}

export function libraryCount() {
  if (document.getElementById('no-results')) {
    if (libraryGetQParam() === benefit) {
      document.getElementById('no-results').style.display = 'none';
      document.getElementById('va-pager-div').style.display = 'flex';
    }
  }

  if (document.getElementById('total-pages')) {
    numCards = libraryNumCards();
    if (document.getElementById('total-pages')) {
      document.getElementById('total-pages').innerText =
        numCards < 0 ? 0 : numCards;
    }
    document.getElementById('total-all').innerText = ` of ${cards.length}`;
    if (libraryGetQParam() === benefit) {
      if (numCards < 1 && document.getElementById('no-results')) {
        document.getElementById('va-pager-div').style.display = 'none';
        document.getElementById('no-results').style.display = 'block';
      }
    }
  }
}

export function libraryCurrent() {
  let increment = 1;
  const itemsPerPage = 10;
  let numVal;
  cards.forEach(element => {
    if (
      !element.classList.contains('hide-topic') &&
      !element.classList.contains('hide-type')
    ) {
      element.setAttribute('data-number', increment);
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
  numCards = libraryNumCards();

  if (document.getElementById('pager-nums-insert')) {
    const diff = pages - activePage;
    let pagerHtml;

    pagerHtml = `<button id="va-pagination-active-num" class="va-page-numbers">
    ${activePage}</button>`;
    if (diff > 1 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `<a class="pager-numbers" aria-label="Load page
      ${activePage + 1}" tabindex="${activePage + 1}">${activePage + 1}</a>`;
    }
    if (diff > 2 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `<a class="pager-numbers"" aria-label="Load page
      ${activePage + 2}" tabindex="${activePage + 2}">${activePage + 2}</a>`;
    }
    if (diff > 3 && (numCards === undefined || numCards > 9)) {
      pagerHtml += `.... <a class="pager-numbers"" aria-label="Load page
      ${pages}" tabindex="${pages}"> ${pages}</a>`;
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
  if (el.srcElement.className === 'pager-numbers') {
    activePage = el.srcElement.tabIndex;
    sessionStorage.setItem('pageNum', el.srcElement.tabIndex);
  }
  if (
    el.srcElement.id === 'pager-next-click' &&
    activePage !== pages &&
    (numCards === undefined || numCards > 9)
  ) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', activePage++);
  }
  if (el.srcElement.id === 'pager-previous-click' && activePage !== 1) {
    activePage = parseInt(activePage, 10);
    sessionStorage.setItem('pageNum', activePage--);
  }
  if (el.srcElement.id === 'first-click') {
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
  }
  if (
    el.srcElement.id === 'last-click' &&
    (numCards === undefined || numCards > 9)
  ) {
    activePage = pages;
    sessionStorage.setItem('pageNum', activePage);
  }

  const selectSwitch = el.srcElement.id === 'outreach-type' ? 'type' : 'topic';

  if (
    el.srcElement.value &&
    el.srcElement.value.length &&
    el.srcElement.value !== 'select'
  ) {
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
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
  const page = libraryGetQParam();
  let el;
  switch (page) {
    case benefit:
      el = document.querySelectorAll('.library-show');
      break;

    case events:
      el = document.querySelectorAll('.events-show');
      break;

    default:
      el = document.querySelectorAll('.office-show');
      break;
  }
  el.forEach(value => {
    const v = value;
    v.style.display = 'block';
  });

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
