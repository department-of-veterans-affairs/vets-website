import React from 'react';

const PromoBannerTypes = {
  announcement: 'announcement',
  news: 'news',
  emailSignup: 'email-signup',
};

const promoBannerIcons = new Map([
  [PromoBannerTypes.announcement, 'fas fa-bullhorn fa-stack-1x'],
  [PromoBannerTypes.news, 'fas fa-newspaper'],
  [PromoBannerTypes.emailSignup, 'fas fa-envelope'],
]);

function PromoBanner({ children, destination, dismiss, type }) {
  const icon = promoBannerIcons.get(type);

  return (
    <div className="va-promo-banner">
      <div className="usa-grid-full">
        <div className="vads-u-display--flex">
          <div className="va-promo-banner-type vads-u-flex--auto">
            <span className="vads-u-color--link-default fa-stack fa-lg">
              <i className="vads-u-color--white fa fa-circle fa-stack-2x" />
              <i className={icon} />
            </span>
          </div>

          <div className="va-promo-banner-content vads-u-flex--1">
            <a href={destination} onClick={dismiss}>
              <strong>{children}</strong>{' '}
              <i className="fas fa-angle-right vads-u-margin-left--1" />
            </a>
          </div>

          <div className="va-promo-banner-dismiss vads-u-flex--auto">
            <button
              type="button"
              aria-label="Dismiss this announcement"
              onClick={dismiss}
              className="va-button-link vads-u-margin-top--1"
            >
              <i className="fas fa-times-circle vads-u-font-size--lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MissionAct({ dismiss }) {
  return (
    <PromoBanner
      dismiss={dismiss}
      type={PromoBannerTypes.announcement}
      destination="https://missionact.va.gov/"
    >
      Learn how you can get easier access to health care with the MISSION Act
    </PromoBanner>
  );
}
