import Timeouts from './timeouts';

// Change select value and trigger change event programatically.
// This is necessary because long select boxes tend to render offscreen,
// causing Selenium to fail in unexpected ways.
function selectDropdown(client, field, value) {
  const select = `select[name='${field}']`;
  client
    .execute((clientSelect, clientValue) => {
      /* eslint-disable */
      var element = document.querySelector(clientSelect);
      var event = new Event('change', { bubbles: true });
      element.value = clientValue;
      element.dispatchEvent(event);
      return element.value;
      /* eslint-disable */
    },
    [select, value]);
}

function overrideVetsGovApi(client) {
  client.execute((url) => {
    const current = window.VetsGov || {};
    window.VetsGov = Object.assign({}, current, {
      api: {
        // eslint-disable-next-line object-shorthand
        url: url
      }
    });
    return window.VetsGov;
  },
  [`http://localhost:${process.env.API_PORT || 4000}`],
  (val) => {
    // eslint-disable-next-line no-console
    console.log(`Result of overriding VetsGov.api.url${JSON.stringify(val)}`);
  });
}

function overrideSmoothScrolling(client) {
  client.execute(() => {
    const current = window.VetsGov || {};
    window.VetsGov = Object.assign({}, current, {
      scroll: {
        duration: 0,
        delay: 0,
        smooth: false
      }
    });
    return window.VetsGov;
  },
  (val) => {
    // eslint-disable-next-line no-console
    console.log(`Setting VetsGov.scroll = ${JSON.stringify(val)}`);
  });
}

// via http://stackoverflow.com/questions/11131875
function overrideAnimations(client) {
  const styles = `* {
     -o-transition-property: none !important;
     -moz-transition-property: none !important;
     -ms-transition-property: none !important;
     -webkit-transition-property: none !important;
      transition-property: none !important;
     -o-transform: none !important;
     -moz-transform: none !important;
     -ms-transform: none !important;
     -webkit-transform: none !important;
     transform: none !important;
     -webkit-animation: none !important;
     -moz-animation: none !important;
     -o-animation: none !important;
     -ms-animation: none !important;
     animation: none !important;
  }`;

  client.execute((str) => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = str;
    document.getElementsByTagName('head')[0].appendChild(style);
  },
  [styles],
  () => {
    // eslint-disable-next-line no-console
    console.log('Overriding animations...');
  });
}

// Returns an object suitable for a nightwatch test case.
//
// Provides test framework maintainers a single entry point for annotating all tests with things
// like uniform reporters.
//
// @param {beginApplication} Callable taking one argument, client, that runs the e2e test.
function createE2eTest(beginApplication) {
  return {
    'Begin application': (client) => {
      overrideSmoothScrolling(client);
      beginApplication(client);
    }
  };
}

// Expects navigation lands at a path with the given `urlSubstring`.
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(Timeouts.normal);
}

function expectValueToBeBlank(client, field) {
  client.expect.element(field).to.have.value.that.equals('');
}

function expectInputToNotBeSelected(client, field) {
  client.expect.element(field).to.not.be.selected;
}

module.exports = {
  baseUrl: `http://localhost:${process.env.WEB_PORT || 3333}`,
  apiUrl: `http://localhost:${process.env.API_PORT || 4000}`,
  createE2eTest,
  expectNavigateAwayFrom,
  expectValueToBeBlank,
  expectInputToNotBeSelected,
  overrideVetsGovApi,
  overrideSmoothScrolling,
  overrideAnimations,
  selectDropdown
};
