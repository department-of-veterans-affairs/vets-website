import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const renderSchoolClosingAlert = result => {
  const { schoolClosing } = result;

  if (!schoolClosing) return null;
  return (
    <AlertBox
      content={<li>Upcoming campus closure</li>}
      headline="A campus is closing soon"
      isVisible={!!schoolClosing}
      status="warning"
    />
  );
};

const renderReasons = cautionFlags => {
  const flags = [];
  cautionFlags
    .sort((a, b) => {
      if (a.reason.toLowerCase() < b.reason.toLowerCase()) return -1;
      if (a.reason.toLowerCase() > b.reason.toLowerCase()) return 1;
      return 0;
    })
    .forEach(flag => {
      flags.push(<li key={flag.id}>{flag.reason}</li>);
    });

  return flags;
};

export const renderCautionAlert = result => {
  const { cautionFlags } = result;

  if (cautionFlags.length === 0) return null;
  return (
    <AlertBox
      content={renderReasons(cautionFlags)}
      headline={
        cautionFlags.length > 1
          ? 'This school has cautionary warnings'
          : 'This school has a cautionary warning'
      }
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
