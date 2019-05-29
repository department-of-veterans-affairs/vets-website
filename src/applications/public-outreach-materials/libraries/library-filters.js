export function libraryFilters(el) {
  const typeItem = document.getElementById('outreach-type');
  function pageNumbers() {
    const currentPage = sessionStorage.getItem('pageNum');
    const cards = document.querySelectorAll('.asset-card');
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

    document.getElementById('va-pagination-active-num').innerText =
      activePage === undefined ? 1 : activePage;

    document.getElementById('total-pages').innerText = cards.length;
  }

  sessionStorage.setItem('pageNum', 1);
  pageNumbers();

  const next = document.getElementById('pager-next-click');
  next.addEventListener('click', libraryFilters);

  const prev = document.getElementById('pager-previous-click');
  prev.addEventListener('click', libraryFilters);

  const first = document.getElementById('first-click');
  first.addEventListener('click', libraryFilters);

  const last = document.getElementById('last-click');
  last.addEventListener('click', libraryFilters);

  typeItem.addEventListener('change', () => {
    if (typeItem.value !== 'select') {
      [].map.call(document.querySelectorAll(`[data-type]`), element => {
        element.classList.add('hide-type');
      });
      [].map.call(
        document.querySelectorAll(`[data-type=${typeItem.value}]`),
        element => {
          element.classList.add('show-type');
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
      [].map.call(document.querySelectorAll(`[data-type]`), element => {
        element.classList.add('show-type');
      });
    }
  });

  const topicItem = document.getElementById('outreach-topic');
  topicItem.addEventListener('change', () => {
    if (topicItem.value !== 'select') {
      [].map.call(document.querySelectorAll(`[data-topic]`), element => {
        element.classList.add('hide-topic');
      });

      [].map.call(
        document.querySelectorAll(`[data-${topicItem.value}]`),
        element => {
          element.classList.add('show-topic');
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
      [].map.call(document.querySelectorAll(`[data-topic]`), element => {
        element.classList.add('show-topic');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', libraryFilters);
