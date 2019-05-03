import { libraryCard } from './library-card';
/**
 * Creates elements for asset library.
 */

export function libraryProcess() {
  let pageNumbers;

  function paginate(array, pageSize, pageNumber) {
    const pagePlace = pageNumber - 1;
    return array.slice(pagePlace * pageSize, (pagePlace + 1) * pageSize);
  }

  function pageNumClick(el) {
    sessionStorage.setItem('pageNum', el.srcElement.textContent);
    pageNumbers();
  }

  function pageReset() {
    sessionStorage.removeItem('topic');
    sessionStorage.removeItem('type');
    sessionStorage.setItem('pageNum', 1);
    pageNumbers();
  }

  async function dataProcess() {
    sessionStorage.removeItem('numOfPages');
    let data = window.VetsGov.outreachAssetsData;
    const topic = sessionStorage.getItem('topic')
      ? sessionStorage.getItem('topic')
      : null;

    const typeFilter = sessionStorage.getItem('type')
      ? sessionStorage.getItem('type')
      : null;

    data = data.entities.filter(item => item.fieldMedia !== null);

    if (topic !== null) {
      data = data.filter(item => item.fieldBenefits.includes(topic));
    }
    if (typeFilter !== null) {
      data = data.filter(item => item.fieldFormat.includes(typeFilter));
    }

    const pageNum = sessionStorage.getItem('pageNum');
    const jsonData = paginate(data, 10, pageNum);
    const numPages = Math.ceil(data.length / 10);
    sessionStorage.setItem('numOfPages', numPages);
    libraryCard(jsonData);
  }

  pageNumbers = () => {
    let i = sessionStorage.getItem('pageNum');
    const num =
      sessionStorage.getItem('numOfPages') !== null
        ? sessionStorage.getItem('numOfPages')
        : 10;

    let output = `<a class="pager-item-number-${i} pager-item-link va-pagination-active" tabindex="0">${i}</a>`;
    const second = ++i;
    const third = ++i;

    if (second <= num) {
      output += `<a class="pager-item-number-${second} pager-item-link" tabindex="0">${second}</a>`;
    }
    if (third <= num) {
      output += `<a class="pager-item-number-${third} pager-item-link" tabindex="0">${third}</a>`;
    }

    const insert = document.getElementById('pager-nums-insert');
    insert.innerHTML = output;
    const pagerNumbers = document.querySelectorAll('.pager-item-link');
    Array.from(pagerNumbers).forEach(el => {
      el.addEventListener('click', pageNumClick);
    });
    dataProcess();
  };

  function pageSetForward() {
    let i = sessionStorage.getItem('pageNum');
    if (i !== sessionStorage.getItem('numOfPages')) {
      sessionStorage.setItem('pageNum', ++i);
      pageNumbers();
    }
  }

  function pageSetBackward() {
    let i = sessionStorage.getItem('pageNum');
    if (i !== '1') {
      sessionStorage.setItem('pageNum', --i);
      pageNumbers();
    }
  }

  const topicItem = document.getElementById('outreach-topic');
  topicItem.addEventListener('change', () => {
    if (topicItem.value !== 'select') {
      sessionStorage.setItem('topic', topicItem.value);
    } else if (topicItem.value === 'select') {
      sessionStorage.removeItem('topic');
      sessionStorage.removeItem('numOfPages');
    }
    sessionStorage.setItem('pageNum', 1);

    pageNumbers();
  });

  const typeItem = document.getElementById('outreach-type');
  typeItem.addEventListener('change', () => {
    if (typeItem.value !== 'select') {
      sessionStorage.setItem('type', typeItem.value);
    } else if (typeItem.value === 'select') {
      sessionStorage.removeItem('type');
      sessionStorage.removeItem('numOfPages');
    }
    sessionStorage.setItem('pageNum', 1);

    pageNumbers();
  });

  const next = document.getElementById('pager-next-click');
  next.addEventListener('click', pageSetForward);

  const prev = document.getElementById('pager-previous-click');
  prev.addEventListener('click', pageSetBackward);

  pageReset();
}
