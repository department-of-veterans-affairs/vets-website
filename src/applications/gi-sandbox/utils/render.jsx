import React from 'react';
import { focusElement } from 'platform/utilities/ui';

export const renderLearnMoreLabel = ({
  text,
  modal,
  ariaLabel,
  showModal,
  component,
  labelFor,
}) => {
  let displayText = text && <React.Fragment>{text} </React.Fragment>;
  if (labelFor && text) {
    displayText = (
      <label
        className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block"
        htmlFor={labelFor}
      >
        {text}
      </label>
    );
  }

  const id = `${modal}-button`;
  return (
    <span
      className="vads-u-margin--0 vads-u-display--inline-block "
      onClick={focusElement(labelFor)}
    >
      {displayText}
      <span className="vads-u-margin--0 vads-u-display--inline-block ">
        (
        <button
          aria-label={ariaLabel}
          id={id}
          type="button"
          className="va-button-link learn-more-button vads-u-margin--0"
          onClick={showModal.bind(component, modal)}
        >
          Learn more
        </button>
        )
      </span>
    </span>
  );
};

export const renderVetTecLogo = classNames => (
  <img
    className={classNames}
    src={'/img/logo/vet-tec-logo.png'}
    alt="Vet Tec Logo"
  />
);
