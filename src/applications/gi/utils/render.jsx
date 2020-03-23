import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';

export const renderSchoolClosingAlert = result => {
  const { schoolClosing, schoolClosingOn } = result;

  if (!schoolClosing) return null;
  // prod flag for bah-7020
  if (schoolClosingOn && !environment.isProduction()) {
    const currentDate = new Date();
    const schoolClosingDate = new Date(schoolClosingOn);
    if (currentDate > schoolClosingDate) {
      return (
        <AlertBox
          headline="This campus has closed"
          content={
            <p>
              This campus has closed. Visit the school's website to learn more.
            </p>
          }
          isVisible={!!schoolClosing}
          status="warning"
        />
      );
    }
  }
  return (
    <AlertBox
      content={<p>Upcoming campus closure</p>}
      headline="School closure"
      isVisible={!!schoolClosing}
      status="warning"
    />
  );
};

export const renderCautionAlert = result => {
  const { cautionFlag } = result;
  if (!cautionFlag) return null;
  return (
    <AlertBox
      content={<p>This school has cautionary warnings</p>}
      headline="Caution"
      isVisible={!!cautionFlag}
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
