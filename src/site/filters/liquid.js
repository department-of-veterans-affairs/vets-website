const moment = require('moment');
const converter = require('number-to-words');
const liquid = require('tinyliquid');

module.exports = function registerFilters() {
  // Custom liquid filter(s)
  liquid.filters.humanizeDate = dt =>
    moment(dt, 'YYYY-MM-DD').format('MMMM D, YYYY');

  liquid.filters.humanizeTimestamp = dt =>
    moment.unix(dt).format('MMMM D, YYYY');

  liquid.filters.formatDate = (dt, format) => moment(dt).format(format);

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

  liquid.filters.facilityIds = facilities =>
    facilities.map(facility => facility.fieldFacilityLocatorApiId).join(',');

  // Used for the react widget "Facilities List" - includes the facility locator api id and the image object from drupal
  liquid.filters.widgetFacilitiesList = facilities => {
    const facilityList = {};
    facilities.forEach(f => {
      // Facility Locator ids - the ids NEED to match what is returned from the facility locator api
      const facilityLocatorApiId = f.fieldFacilityLocatorApiId
        .split('_')[1]
        .toUpperCase();
      const id = `vha_`.concat(facilityLocatorApiId);

      facilityList[id] = f.fieldMedia ? f.fieldMedia.entity.image : {};
      facilityList[id].entityUrl = f.entityUrl;
      facilityList[id].nickname = f.fieldNicknameForThisFacility;
    });
    return JSON.stringify(facilityList);
  };

  liquid.filters.widgetFacilityDetail = facility => {
    const facilityLocatorApiId = facility.split('_')[1].toUpperCase();
    const id = `vha_${facilityLocatorApiId}`;
    return JSON.stringify(id);
  };
};
