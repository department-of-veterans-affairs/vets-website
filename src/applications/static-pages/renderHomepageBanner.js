const yaml = require('js-yaml');

const HOMEPAGE_BANNER_YML_LOCATION =
  'https://raw.githubusercontent.com/department-of-veterans-affairs/vagov-content/master/fragments/home/banner.yml';

async function renderHomepageBanner() {
  const response = await fetch(HOMEPAGE_BANNER_YML_LOCATION, {
    mode: 'cors',
  });

  const homepageBannerYml = await response.text();
  const homepageBanner = yaml.safeLoad(homepageBannerYml);

  if (!homepageBanner.visible) {
    return;
  }

  const root = document.getElementById('homepage-banner');

  root.innerHTML = `
    <div class="usa-alert-full-width usa-alert-full-width-${
      homepageBanner.type
    }">
      <div aria-live="polite" role="alert" class="usa-alert usa-alert-${
        homepageBanner.type
      }">
        <div class="usa-alert-body">
          <h3 class="usa-alert-heading">${homepageBanner.title}</h3>
          <div class="usa-alert-text">
            ${homepageBanner.content}
          </div>
        </div>
      </div>
    </div>
  `;
}

export default renderHomepageBanner;
