import yaml from 'js-yaml';
import * as Sentry from '@sentry/browser';

const HOMEPAGE_BANNER_YML_LOCATION =
  'https://raw.githubusercontent.com/department-of-veterans-affairs/vagov-content/master/fragments/home/banner.yml';

async function loadConfigFromGitHub() {
  const response = await fetch(HOMEPAGE_BANNER_YML_LOCATION, {
    mode: 'cors',
  });

  const homepageBannerYml = await response.text();
  return yaml.safeLoad(homepageBannerYml);
}

function renderToDocument(banner) {
  if (!banner.visible) {
    return;
  }

  const root = document.getElementById('homepage-banner');

  root.innerHTML = `
    <div class="usa-alert-full-width usa-alert-full-width-${banner.type}">
      <div aria-live="polite" role="alert" class="usa-alert usa-alert-${
        banner.type
      }">
        <div class="usa-alert-body">
          <h3 class="usa-alert-heading">${banner.title}</h3>
          <div class="usa-alert-text">
            ${banner.content}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function renderHomepageBanner() {
  try {
    const banner = await loadConfigFromGitHub();
    renderToDocument(banner);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`Homepage Banner Error: ${error.message}`);
    });
  }
}

export default renderHomepageBanner;
