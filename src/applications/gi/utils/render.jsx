import React from 'react';

export const renderSchoolClosingFlag = result => {
  const { schoolClosing } = result;
  if (!schoolClosing) return null;
  return (
    <div className="caution-flag">
      <i className="fa fa-warning" />
      School closing
    </div>
  );
};

export const renderCautionFlag = result => {
  const { cautionFlag } = result;
  if (!cautionFlag) return null;
  return (
    <div className="caution-flag">
      <i className="fa fa-warning" />
      Caution
    </div>
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

export const renderLabel = ({ name, text, modal, showModal, component }) => {
  if (modal) {
    return (
      <span>
        <label htmlFor={name} className="dropdown-learn-more-label">
          {' '}
          {text}{' '}
        </label>
        <button
          type="button"
          className="va-button-link learn-more-button"
          onClick={showModal.bind(component, modal)}
        >
          (Learn more)
        </button>
      </span>
    );
  }
  return <label htmlFor={name}> {text} </label>;
};

export const renderVetTecLogo = classNames => (
  <img
    className={classNames}
    src={'/img/logo/vet-tec-logo.png'}
    alt="Vet Tec Logo"
  />
);
