/**
 * Creates elements for asset library.
 */
export function filterLibrary() {
  const assets = `https://raw.githubusercontent.com/ethanteague/va-assets-array/master/assets.json`;

  let pageNumbers;

  function paginate(array, pageSize, pageNumber) {
    const pagePlace = pageNumber - 1;
    return array.slice(pagePlace * pageSize, (pagePlace + 1) * pageSize);
  }

  function fileType(data) {
    const split = data.split('.');
    return split.slice(-1).pop();
  }

  function pageNumClick(el) {
    sessionStorage.setItem('pageNum', el.srcElement.textContent);
    pageNumbers();
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
    const data = await getJSON(assets);
    const pageNum = sessionStorage.getItem('pageNum');
    const jsonData = paginate(data.data.fileQuery.entities, 10, pageNum);
    const numPages = Math.ceil(data.data.fileQuery.entities.length / 10);
    sessionStorage.setItem('numOfPages', numPages);
    let output = '';
    let type = '';
    let url = '';
    const images = ['jpg', 'jpeg', 'png', 'ics'];
    jsonData.forEach((json, index) => {
      type = fileType(json.filename);
      url = json.url;
      if (index % 2 === 0) {
        output += `<div class="vads-l-row">`;
      }
      output += `<div class="vads-l-col--6 vads-u-padding-right--4 vads-u-padding-bottom--4 asset-card">`;
      if (images.includes(type)) {
        output += `<div class="asset-image-wrap"><img width="318" height="212" src="${url}" onerror="this.onerror=null;this.src='https://via.placeholder.com/318x212';"/></div>`;
      }
      output += `<div class="asset-body-wrap"></div>`;
      output += `</div>`;
      if (index % 2 !== 0 || index === jsonData.length - 1) {
        output += `</div>`;
      }
    });
    document.getElementById('search-entry').innerHTML = output;
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
      dataProcess();
    }
  }

  function pageSetBackward() {
    let i = sessionStorage.getItem('pageNum');
    if (i !== '1') {
      sessionStorage.setItem('pageNum', --i);
      pageNumbers();
      dataProcess();
    }
  }

  const next = document.getElementById('pager-next-click');
  next.addEventListener('click', pageSetForward);

  const prev = document.getElementById('pager-previous-click');
  prev.addEventListener('click', pageSetBackward);

  sessionStorage.setItem('pageNum', 1);
  dataProcess();
  pageNumbers();
}

document.addEventListener('DOMContentLoaded', filterLibrary);
