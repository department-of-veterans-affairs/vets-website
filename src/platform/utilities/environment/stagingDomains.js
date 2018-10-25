import { mhvBaseUrl } from '../../site-wide/cta-widget/helpers';

let currentEnv = 'dev';
if (__BUILDTYPE__.includes('staging')) {
  currentEnv = 'staging';
}

if (__BUILDTYPE__ === 'preview') {
  currentEnv = 'preview';
}

if (__BUILDTYPE__ === 'production') {
  currentEnv = 'www';
}

// This list also exists in script/options.js
const domainReplacements = [
  {
    from: 'https://www\\.va\\.gov',
    // use relative links on dev to accomodate localhost
    to: currentEnv === 'dev' ? '' : `https://${currentEnv}.va.gov`,
  },
  { from: 'https://www\\.myhealth\\.va\\.gov', to: mhvBaseUrl() },
];

// This doesn't include preview because we want to redirect to staging urls
// in preview
const prodEnvironments = new Set(['production']);

export function replaceWithStagingDomain(href) {
  let newHref = href;
  domainReplacements.forEach(domain => {
    newHref = newHref.replace(new RegExp(domain.from, 'g'), domain.to);
  });

  return newHref;
}

/**
 * replaceDomainsInData traverses a data object looking for properties
 * with a certain name. When it finds that name, it looks to see if
 * they match a value in the domainReplacements list, and replaces that
 * domain with another if they do.
 *
 * We use this to rewrite links to point to a staging domain for environments
 * below production
 *
 * @param data the data object to traverse and look for links in
 * @param keyToCheck='href' The property name where we expect a link
 *  string to live
 * @returns {Object} A object with the same structure as the data
 *  argument, with domains replaced
 */
export function replaceDomainsInData(data, keyToCheck = ['href', 'src']) {
  if (prodEnvironments.has(__BUILDTYPE__)) {
    return data;
  }

  let current = data;
  if (Array.isArray(data)) {
    // This means we're always creating a shallow copy of arrays, but
    // that seems worth the complexity trade-off
    current = data.map(item => replaceDomainsInData(item, keyToCheck));
  } else if (!!current && typeof current === 'object') {
    Object.keys(current).forEach(key => {
      let newValue = current;

      // We're assuming that keys provided in keyToCheck are strings
      if (keyToCheck.includes(key)) {
        newValue = replaceWithStagingDomain(current[key]);
      } else {
        newValue = replaceDomainsInData(current[key], keyToCheck);
      }

      if (newValue !== current[key]) {
        current = Object.assign({}, current, {
          [key]: newValue,
        });
      }
    });
  }

  return current;
}
