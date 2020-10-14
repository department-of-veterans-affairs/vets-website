import React from 'react';
import AlertBox from '../components/AlertBox';
import { focusElement } from 'platform/utilities/ui';
import { convertRatingToStars } from './helpers';

export const renderSchoolClosingAlert = result => {
  const { schoolClosing, schoolClosingOn } = result;

  if (!schoolClosing) return null;

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
      content={<p>School will be closing soon</p>}
      headline="School closing"
      isVisible={!!schoolClosing}
      status="warning"
    />
  );
};

export const renderCautionAlert = cautionFlags => {
  const validFlags = [...cautionFlags]
    .filter(flag => flag.title)
    .sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1));

  return (
    <AlertBox
      className="vads-u-margin-top--0"
      content={
        <React.Fragment>
          {validFlags.length === 1 && <p>{validFlags[0].title}</p>}
          {validFlags.length > 1 && (
            <ul className="vads-u-margin-top--0">
              {validFlags.map((flag, index) => (
                <li
                  className="vads-u-margin-y--0p25 vads-u-margin-left--1p5"
                  key={`caution-flag-alert-${index}`}
                >
                  {flag.title}
                </li>
              ))}
            </ul>
          )}
        </React.Fragment>
      }
      headline={
        validFlags.length > 1
          ? 'This school has cautionary warnings'
          : 'This school has a cautionary warning'
      }
      isVisible={validFlags.length > 0}
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

export const renderSearchResultsHeader = search => {
  const header = search.count === 1 ? 'Search Result' : 'Search Results';

  return (
    <h1 tabIndex={-1}>
      {!search.inProgress &&
        `${(search.count || 0).toLocaleString()} ${header}`}
    </h1>
  );
};

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
