const moment = require('moment');
const converter = require('number-to-words');
const liquid = require('tinyliquid');
const _ = require('lodash');

function getPath(obj) {
  return obj.path;
}

module.exports = function registerFilters() {
  const {
    featureFlags,
    enabledFeatureFlags,
  } = require('../utilities/featureFlags');

  // Custom liquid filter(s)
  liquid.filters.humanizeDate = dt =>
    moment(dt, 'YYYY-MM-DD').format('MMMM D, YYYY');

  liquid.filters.humanizeTime = dt => moment(dt).format('LT');

  liquid.filters.humanizeTimestamp = dt =>
    moment.unix(dt).format('MMMM D, YYYY');

  liquid.filters.formatDate = (dt, format) => moment(dt).format(format);

  liquid.filters.dateFromUnix = (dt, format) => moment.unix(dt).format(format);

  liquid.filters.unixFromDate = data => new Date(data).getTime();

  liquid.filters.currentUnixFromDate = () => {
    const time = new Date();
    return time.getTime();
  };

  liquid.filters.numToWord = numConvert => converter.toWords(numConvert);

  liquid.filters.jsonToObj = jsonString => JSON.parse(jsonString);

  liquid.filters.modulo = item => item % 2;

  liquid.filters.listValue = data => {
    const string = data.split('_').join(' ');
    return string;
  };

  liquid.filters.fileType = data => {
    const string = data
      .split('.')
      .slice(-1)
      .pop();
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  liquid.filters.fileExt = data => {
    const string = data
      .split('.')
      .slice(-1)
      .pop();
    return string;
  };

  liquid.filters.breakIntoSingles = data => {
    let output = '';
    if (data != null) {
      output = `data-${data} `;
    }
    return output;
  };

  liquid.filters.videoThumbnail = data => {
    const string = data.split('v=')[1];
    return `https://img.youtube.com/vi/${string}/sddefault.jpg`;
  };

  liquid.filters.outputLinks = data => {
    // Change phone to tap to dial.
    const replacePattern = /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/;
    const number = data.match(replacePattern)[0];
    const replacedText = data.replace(
      replacePattern,
      `<a href="tel:${number}">Phone: ${number}</a>`,
    );

    return replacedText;
  };

  liquid.filters.breakTerms = data => {
    let output = '';
    if (data != null) {
      const count = data.length;
      data.forEach((element, index) => {
        if (index < count - 1) {
          output += `${element}, `;
        } else {
          output += `${element}`;
        }
      });
    }
    return output;
  };

  liquid.filters.locationUrlConvention = facility =>
    facility.fieldNicknameForThisFacility
      ? facility.fieldNicknameForThisFacility.replace(/\s+/g, '-').toLowerCase()
      : facility.fieldFacilityLocatorApiId;

  liquid.filters.hashReference = str =>
    str
      .toLowerCase()
      .split(' ')
      .join('-');

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

  // Find the current path in an array of nested link arrays and then return it's depth + it's parent and children
  liquid.filters.findCurrentPathDepth = (linksArray, currentPath) => {
    const getDeepLinks = (path, linkArr) => {
      const deepObj = {};
      for (let a = 0; a < linkArr.length; a += 1) {
        if (linkArr[a].url.path === path) {
          deepObj.depth = 1;
          return deepObj;
        }
        if (linkArr[a].links) {
          for (let b = 0; b < linkArr[a].links.length; b += 1) {
            if (linkArr[a].links[b].url.path === path) {
              deepObj.depth = 2;
              return deepObj;
            }
            if (linkArr[a].links[b].links) {
              for (let c = 0; c < linkArr[a].links[b].links.length; c += 1) {
                if (linkArr[a].links[b].links[c].url.path === path) {
                  deepObj.depth = 3;
                  deepObj.links = linkArr[a].links[b];
                  return deepObj;
                }
                if (linkArr[a].links[b].links[c].links) {
                  for (
                    let d = 0;
                    d < linkArr[a].links[b].links[c].links.length;
                    d += 1
                  ) {
                    if (
                      linkArr[a].links[b].links[c].links[d].url.path === path
                    ) {
                      deepObj.depth = 4;
                      deepObj.links = linkArr[a].links[b].links[c];
                      return deepObj;
                    }
                    if (linkArr[a].links[b].links[c].links[d].links) {
                      for (
                        let e = 0;
                        e < linkArr[a].links[b].links[c].links[d].links.length;
                        e++
                      ) {
                        if (
                          linkArr[a].links[b].links[c].links[d].links[e].url
                            .path === path
                        ) {
                          deepObj.depth = 5;
                          deepObj.links = linkArr[a].links[b].links[c].links[d];
                          return deepObj;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return false;
    };

    return JSON.stringify(getDeepLinks(currentPath, linksArray));
  };

  liquid.filters.featureFieldRegionalHealthService = entity => {
    if (
      entity &&
      enabledFeatureFlags[featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE]
    ) {
      return entity.fieldRegionalHealthService
        ? entity.fieldRegionalHealthService.entity
        : null;
    }
    return entity && entity.fieldClinicalHealthServices
      ? entity.fieldClinicalHealthServices[0].entity
      : null;
  };

  // used to get a base url path of a health care region from entityUrl.path
  liquid.filters.regionBasePath = path => path.split('/')[1];

  liquid.filters.isPage = (path, page) => path.includes(page);

  // check is this is a root level page
  liquid.filters.isRootPage = path => {
    const isFacilityRoot = /^(?:\/pittsburgh-health-care)+$|^(?:\/pittsburgh-health-care)\/((?!stories|events|locations|press-releases|health-services|jobs-careers).)*$/;
    const isRoot = /^\/[\w-]+$/;
    return isRoot.test(path) || isFacilityRoot.test(path);
  };

  // check if this is an about menu page
  liquid.filters.isAboutItem = (menuArray, path) => {
    const paths = _.flatMap(menuArray, getPath);
    const inMenu = _.indexOf(paths, path);
    return inMenu !== -1;
  };

  // sort a list of objects by a certain property in the object
  liquid.filters.sortObjectsBy = (entities, path) => _.sortBy(entities, path);

  // get a value from a path of an object
  liquid.filters.getValueFromObjPath = (obj, path) => _.get(obj, path);

  // get a value from a path of an object in an array
  liquid.filters.getValueFromArrayObjPath = (entities, index, path) =>
    _.get(entities[index], path);
};
