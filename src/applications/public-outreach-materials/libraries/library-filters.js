export function libraryFilters() {

  const typeItem = document.getElementById('outreach-type');

  typeItem.addEventListener('change', () => {
    if (typeItem.value !== 'select') {

      [].map.call(document.querySelectorAll(`[data-type]`), function (element) {
        element.classList.add('hide-type');
      });
      [].map.call(document.querySelectorAll(`[data-type=${typeItem.value}]`), function (element) {
        element.classList.add('show-type');
      });
      [].map.call(document.querySelectorAll(`[data-type=${typeItem.value}]`), function (element) {
        element.classList.remove('hide-type');
      });

    } else if (typeItem.value === 'select') {
      [].map.call(document.querySelectorAll(`[data-type]`), function (element) {
        element.classList.remove('hide-type');
      });
      [].map.call(document.querySelectorAll(`[data-type]`), function (element) {
        element.classList.add('show-type');
      });
    }
  });

  const topicItem = document.getElementById('outreach-topic');
  topicItem.addEventListener('change', () => {
    if (topicItem.value !== 'select') {

      let items = topicItem.value.split(',');

      [].map.call(document.querySelectorAll(`[data-topic]`), function (element) {
        element.classList.add('hide-topic');
      });

      [].map.call(document.querySelectorAll(`[data-topic=${topicItem.value}]`), function (element) {
        element.classList.add('show-topic');
      });
      [].map.call(document.querySelectorAll(`[data-topic=${topicItem.value}]`), function (element) {
        element.classList.remove('hide-topic');
      });

    } else if (topicItem.value === 'select') {
      [].map.call(document.querySelectorAll(`[data-topic]`), function (element) {
        element.classList.remove('hide-topic');
      });
      [].map.call(document.querySelectorAll(`[data-topic]`), function (element) {
        element.classList.add('show-topic');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', libraryFilters);
