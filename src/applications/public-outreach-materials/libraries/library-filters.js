const cards = document.querySelectorAll('.asset-card');
export function libraryFilters(el) {
  sessionStorage.setItem('pageNum', 1);
  const currentPage = sessionStorage.getItem('pageNum');
  const pages = Math.ceil(cards.length / 10);
  let activePage;

  if (el.srcElement.id === 'pager-next-click') {
    activePage = parseInt(currentPage, 10);
    sessionStorage.setItem('pageNum', activePage++);
  }
  if (el.srcElement.id === 'pager-previous-click') {
    activePage = parseInt(currentPage, 10);
    sessionStorage.setItem('pageNum', activePage - 1);
  }
  if (el.srcElement.id === 'first-click') {
    activePage = 1;
    sessionStorage.setItem('pageNum', 1);
  }
  if (el.srcElement.id === 'last-click') {
    activePage = pages;
    sessionStorage.setItem('pageNum', activePage);
  }

  cards.forEach(element => {
    const numVal = element.getAttribute('data-number');
    if (numVal > activePage * 10 || numVal < activePage * 10 - 9) {
      element.classList.add('pager-hide');
    } else {
      element.classList.remove('pager-hide');
    }
    if (activePage === undefined) {
      if (numVal > 10) {
        element.classList.add('pager-hide');
      }
    }
  });

  if (document.getElementById('va-pagination-active-num')) {
    document.getElementById('va-pagination-active-num').innerText =
      activePage === undefined ? 1 : activePage;
  }
}

export function libraryCount() {
  if (document.getElementById('total-pages')) {
    const numCards = document.querySelectorAll(
      '.asset-card:not(.hide-topic):not(.hide-type)',
    ).length;
    if (document.getElementById('total-pages')) {
      document.getElementById('total-pages').innerText =
        numCards < 0 ? 0 : numCards;
    }
  }
}

export function libraryListeners() {
  const typeItem = document.getElementById('outreach-type');
  const pagingEl = document.querySelector('.va-pagination');
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
      } else if (typeItem.value === 'select') {
        [].map.call(document.querySelectorAll(`[data-type]`), element => {
          element.classList.remove('hide-type');
        });
      }
    });
    typeItem.addEventListener('change', libraryCount);
  }

  const topicItem = document.getElementById('outreach-topic');
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
      } else if (topicItem.value === 'select') {
        [].map.call(document.querySelectorAll(`[data-topic]`), element => {
          element.classList.remove('hide-topic');
        });
      }
    });
    topicItem.addEventListener('change', libraryCount);
  }
}
