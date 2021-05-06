import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import { convertRatingToStars } from './helpers';

export const renderStars = rating => {
  const starData = convertRatingToStars(rating);

  if (!starData) {
    return null;
  }

  const stars = [];
  for (let i = 0; i < starData.full; i++) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star vads-u-color--gold-darker"
      />,
    );
  }

  if (starData.half) {
    stars.push(
      <i
        key={stars.length}
        className="fas fa-star-half-alt vads-u-color--gold-darker"
      />,
    );
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <i
        key={stars.length}
        className="far fa-star vads-u-color--gold-darker"
      />,
    );
  }

  return (
    <div className="rating-stars vads-u-display--inline-block">{stars}</div>
  );
};

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
