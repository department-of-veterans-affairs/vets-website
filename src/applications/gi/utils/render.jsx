import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const renderSchoolClosingAlert = result => {
  const { schoolClosing } = result;
  if (!schoolClosing) return null;
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
