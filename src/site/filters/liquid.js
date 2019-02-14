const moment = require('moment');
const converter = require('number-to-words');
const liquid = require('tinyliquid');

module.exports = function registerFilters() {
  // Custom liquid filter(s)
  liquid.filters.humanizeDate = dt =>
    moment(dt, 'YYYY-MM-DD').format('MMMM D, YYYY');

  liquid.filters.humanizeTimestamp = dt =>
    moment.unix(dt).format('MMMM D, YYYY');

  liquid.filters.dateFromUnix = (dt, format) => moment.unix(dt).format(format);

  liquid.filters.numToWord = numConvert => converter.toWords(numConvert);

  liquid.filters.jsonToObj = jsonString => JSON.parse(jsonString);

  liquid.filters.hashReference = str =>
    str
      .toLowerCase()
      .split(' ')
      .join('-');

  liquid.filters.paragraphsToWidgets = paragraphs =>
    paragraphs
      .filter(
        paragraph =>
          paragraph.entity.entityBundle === 'react_widget' &&
          paragraph.entity.fieldCtaWidget === false,
      )
      .map((paragraph, index) => ({
        root: `react-widget-${index + 1}`,
        timeout: paragraph.entity.fieldTimeout,
        loadingMessage: paragraph.entity.fieldLoadingMessage,
        errorMessage: paragraph.entity.errorMessage,
      }));
};
