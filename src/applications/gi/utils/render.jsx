import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';

export const renderSchoolClosingAlert = result => {
  const { schoolClosing, schoolClosingOn } = result;

  if (!schoolClosing) return null;
  // Prod flag for 6803
  // prod flag for bah-7020
  if (!environment.isProduction()) {
    if (schoolClosingOn) {
      const currentDate = new Date();
      const schoolClosingDate = new Date(schoolClosingOn);
      if (currentDate > schoolClosingDate) {
        return (
          <AlertBox
            className="vads-u-margin-top--1"
            headline="School closed"
            content={<p>School has closed</p>}
            isVisible={!!schoolClosing}
            status="warning"
          />
        );
      }
    }
    return (
      <AlertBox
        className="vads-u-margin-top--1"
        content={<p>A campus at this school will be closing soon</p>}
        headline="A campus is closing soon"
        isVisible={!!schoolClosing}
        status="warning"
      />
    );
  }

  return (
    <AlertBox
      className="vads-u-margin-top--1"
      content={<p>Upcoming campus closure</p>}
      headline="School closure"
      isVisible={!!schoolClosing}
      status="warning"
    />
  );
};

export const renderCautionAlert = result => {
  const { cautionFlags } = result;
  if (cautionFlags.length === 0) return null;

  // Prod flag for 6803
  if (!environment.isProduction()) {
    return (
      <AlertBox
        className="vads-u-margin-top--1"
        content={
          <ul className="vads-u-margin-top--0">
            {[...cautionFlags]
              .sort(
                (a, b) =>
                  a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1,
              )
              .map(flag => (
                <li
                  className="vads-u-margin-y--0p25 vads-u-margin-left--1p5"
                  key={flag.id}
                >
                  {flag.title}
                </li>
              ))}
          </ul>
        }
        headline={
          cautionFlags.length > 1
            ? 'This school has cautionary warnings'
            : 'This school has a cautionary warning'
        }
        isVisible={cautionFlags.length > 0}
        status="warning"
      />
    );
  }
  return (
    <AlertBox
      className="vads-u-margin-top--1"
      content={<p>This school has cautionary warnings</p>}
      headline="Caution"
      isVisible={cautionFlags.length > 0}
      status="warning"
    />
  );
};

export const renderPreferredProviderFlag = result => {
  const { preferredProvider } = result;
  if (!preferredProvider) return <br />;
  return (
    <div className="preferred-flag">
      <i className="fa fa-star vads-u-color--gold" />
      Preferred Provider
    </div>
  );
};

export const renderLearnMoreLabel = ({
  text,
  modal,
  ariaLabel,
  showModal,
  component,
}) => (
  <span>
    {text}{' '}
    <button
      aria-label={ariaLabel}
      type="button"
      className="va-button-link learn-more-button"
      onClick={showModal.bind(component, modal)}
    >
      (Learn more)
    </button>
  </span>
);

export const renderVetTecLogo = classNames => (
  <img
    className={classNames}
    src={'/img/logo/vet-tec-logo.png'}
    alt="Vet Tec Logo"
  />
);
