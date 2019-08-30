import yaml from 'js-yaml';
import * as Sentry from '@sentry/browser';
import sanitizeHtml from 'sanitize-html';

// https://github.com/department-of-veterans-affairs/vagov-content/blob/master/fragments/home/banner.yml

const HOMEPAGE_BANNER_YML_LOCATION =
  'https://github.com/department-of-veterans-affairs/vagov-content/blob/master/fragments/home/banner.yml';

const ACCEPTABLE_CONTENT_TAGS = [
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'b',
  'i',
  'strong',
  'em',
  'hr',
  'br',
  'div',
];

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

  const type = sanitizeHtml(banner.type, {
    allowedTags: [],
  });

  const title = sanitizeHtml(banner.title, {
    allowedTags: ['b', 'i', 'strong', 'em'],
  });

  const content = sanitizeHtml(banner.content, {
    allowedTags: ACCEPTABLE_CONTENT_TAGS,
  });

  const root = document.getElementById('homepage-banner');

  root.innerHTML = `
    <div class="usa-alert-full-width usa-alert-full-width-${type}">
      <div aria-live="polite" role="alert" class="usa-alert usa-alert-${type}">
        <div class="usa-alert-body">
          <h3 class="usa-alert-heading">${title}</h3>
          <div class="usa-alert-text">
            ${content}
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
