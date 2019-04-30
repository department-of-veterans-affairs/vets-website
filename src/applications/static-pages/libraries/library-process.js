import { libraryCard } from './library-card';
/**
 * Creates elements for asset library.
 */

export function libraryProcess(assets) {
  let pageNumbers;

  function paginate(array, pageSize, pageNumber) {
    const pagePlace = pageNumber - 1;
    return array.slice(pagePlace * pageSize, (pagePlace + 1) * pageSize);
  }

  function pageNumClick(el) {
    sessionStorage.setItem('pageNum', el.srcElement.textContent);
    pageNumbers();
  }

  function compareType(a, b) {
    if (a.fieldMedia.entity.entityBundle > b.fieldMedia.entity.entityBundle) {
      return 1;
    }
    if (b.fieldMedia.entity.entityBundle > a.fieldMedia.entity.entityBundle) {
      return -1;
    }

    return 0;
  }

  function compareDate(a, b) {
    if (a.changed > b.changed) {
      return -1;
    }
    if (b.changed > a.changed) {
      return 1;
    }

    return 0;
  }

  function getJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        const status = xhr.status;
        if (status === 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  }

  async function dataProcess() {
    sessionStorage.removeItem('numOfPages');
    let data = await getJSON(assets);

    const topic = sessionStorage.getItem('topic')
      ? sessionStorage.getItem('topic')
      : null;

    const typeFilter = sessionStorage.getItem('type')
      ? sessionStorage.getItem('type')
      : null;

    const sortFilter = sessionStorage.getItem('sort')
      ? sessionStorage.getItem('sort')
      : null;

    data = data.data.nodeQuery.entities.filter(
      item => item.fieldMedia !== null,
    );

    if (topic !== null) {
      data = data.filter(item => item.fieldBenefits.includes(topic));
    }
    if (typeFilter !== null) {
      data = data.filter(item =>
        item.fieldMedia.entity.entityBundle.includes(typeFilter),
      );
    }
    if (sortFilter !== null) {
      data =
        sortFilter === 'type' ? data.sort(compareType) : data.sort(compareDate);
    }
    const pageNum = sessionStorage.getItem('pageNum');
    const jsonData = paginate(data, 10, pageNum);
    const numPages = Math.ceil(data.length / 10);
    sessionStorage.setItem('numOfPages', numPages);
    libraryCard(jsonData);
  }

  pageNumbers = () => {
    let i = sessionStorage.getItem('pageNum');
    let output = `<a class="pager-item-number-${i} pager-item-link va-pagination-active" tabindex="0">${i}</a>`;
    const second = ++i;
    const third = ++i;
    if (second <= sessionStorage.getItem('numOfPages')) {
      output += `<a class="pager-item-number-${second} pager-item-link" tabindex="0">${second}</a>`;
    }
    if (third <= sessionStorage.getItem('numOfPages')) {
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

  const sortItem = document.getElementById('outreach-sort');
  sortItem.addEventListener('change', () => {
    if (sortItem.value !== 'select') {
      sessionStorage.setItem('sort', sortItem.value);
    } else if (sortItem.value === 'select') {
      sessionStorage.removeItem('sort');
      sessionStorage.removeItem('numOfPages');
    }
    sessionStorage.setItem('pageNum', 1);

    pageNumbers();
  });

  const next = document.getElementById('pager-next-click');
  next.addEventListener('click', pageSetForward);

  const prev = document.getElementById('pager-previous-click');
  prev.addEventListener('click', pageSetBackward);

  sessionStorage.removeItem('topic');
  sessionStorage.removeItem('type');
  sessionStorage.removeItem('sort');
  sessionStorage.setItem('pageNum', 1);
  pageNumbers();
}
