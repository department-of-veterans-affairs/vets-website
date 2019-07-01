const cards = document.querySelectorAll('.asset-card');
let activePage = 1;
const benefit = 'benefit';
const events = 'events';

export function libraryGetQParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = urlParams.getAll('q');
  return currentPage[0];
}

export function libraryCount() {
  if (document.getElementById('no-results')) {
    if (libraryGetQParam() === benefit) {
      document.getElementById('no-results').style.display = 'none';
      document.getElementById('va-pager-div').style.display = 'flex';
    }
  }

  if (document.getElementById('total-pages')) {
    const numCards = document.querySelectorAll(
      '.asset-card:not(.pager-hide):not(.hide-topic):not(.hide-type)',
    ).length;
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
  cards.forEach(element => {
    const numVal = element.getAttribute('data-number');
    const itemsPerPage = 10;
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

export function libraryFilters(el) {
  const pages = Math.ceil(cards.length / 10);
  if (el.srcElement.id === 'pager-next-click' && activePage !== pages) {
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
  if (el.srcElement.id === 'last-click') {
    activePage = pages;
    sessionStorage.setItem('pageNum', activePage);
  }

  if (document.getElementById('va-pagination-active-num')) {
    document.getElementById('va-pagination-active-num').innerText =
      activePage === undefined ? 1 : activePage;
  }
  libraryCurrent();
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

  if (typeItem) {
    typeItem.addEventListener('change', () => {
      if (typeItem.value !== 'select') {
        [].map.call(
          document.querySelectorAll(
            `[data-type]:not([data-type=${typeItem.value}])`,
          ),
          element => {
            element.classList.add('hide-type');
          },
        );
        [].map.call(
          document.querySelectorAll(`[data-type=${typeItem.value}]`),
          element => {
            element.classList.remove('hide-type');
          },
        );
        cards.forEach(element => {
          element.classList.remove('pager-hide');
        });
      } else if (typeItem.value === 'select' && topicItem.value !== 'select') {
        [].map.call(document.querySelectorAll(`[data-type]`), element => {
          element.classList.remove('hide-type');
        });
      } else if (typeItem.value === 'select' && topicItem.value === 'select') {
        window.location.reload();
      }
      libraryCount();
    });
  }

  if (topicItem) {
    topicItem.addEventListener('change', () => {
      if (topicItem.value !== 'select') {
        [].map.call(
          document.querySelectorAll(
            `[data-topic]:not([data-topic=${topicItem.value}])`,
          ),
          element => {
            element.classList.add('hide-topic');
          },
        );
        [].map.call(
          document.querySelectorAll(`[data-${topicItem.value}]`),
          element => {
            element.classList.remove('hide-topic');
          },
        );
        cards.forEach(element => {
          element.classList.remove('pager-hide');
        });
      } else if (topicItem.value === 'select' && typeItem.value !== 'select') {
        [].map.call(document.querySelectorAll(`[data-topic]`), element => {
          element.classList.remove('hide-topic');
        });
      } else if (topicItem.value === 'select' && typeItem.value === 'select') {
        window.location.reload();
      }
      libraryCount();
    });
  }

  libraryCurrent();
  libraryCount();
}
