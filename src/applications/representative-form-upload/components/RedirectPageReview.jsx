import React from 'react';
import PropTypes from 'prop-types';
import SSNWidget from 'platform/forms-system/src/js/review/SSNWidget';
import VAFileNumberWidget from 'platform/forms-system/src/js/review/VAFileNumberWidget';
import { format, parseISO } from 'date-fns';

const dateFormat = 'MM-dd-yyyy';
const veteranLabels = {
  yes: 'The claimant is the Veteran',
  no: 'The claimant is a survivor or dependent of the Veteran',
};

const itfTypes = {
  compensation: 'Disability compensation',
  pension: 'Pension',
  survivor:
    'Survivors pension and/or dependency and indemnity compensation (DIC)',
};

const RedirectPageReview = props => {
  const { data, goToPath, title } = props;

  const renderIsVeteran = () => {
    return (
      <dl className="review">
        <div className="review-row">
          <dt>What is the claimant’s relationship to the Veteran?</dt>
          <dd>{veteranLabels[data.isVeteran]}</dd>
        </div>
      </dl>
    );
  };

  const renderVeteranInfo = (showHeader = false) => {
    return (
      <>
        {showHeader && (
          <h5 className="vads-u-font-size--h4">
            Veteran idententification information
          </h5>
        )}
        <dl className="review">
          <div className="review-row">
            <dt>First name</dt>
            <dd>{data.veteranFullName.first}</dd>
          </div>
          <div className="review-row">
            <dt>Last name</dt>
            <dd>{data.veteranFullName.last}</dd>
          </div>
          <div className="review-row">
            <dt>Social Security number</dt>
            <dd>
              <SSNWidget value={data.veteranSsn} />
            </dd>
          </div>
          <div className="review-row">
            <dt>Date of birth</dt>
            <dd>{format(parseISO(data.veteranDateOfBirth), dateFormat)}</dd>
          </div>
          <div className="review-row">
            <dt>VA file number</dt>
            <dd>
              {data.vaFileNumber ? (
                <VAFileNumberWidget value={data.vaFileNumber} />
              ) : (
                '-'
              )}
            </dd>
          </div>
          <div className="review-row">
            <dt>Select the benefit you intend to file a claim for</dt>
            <dd>{itfTypes[data.benefitType]}</dd>
          </div>
        </dl>
      </>
    );
  };
  const renderClaimantInfo = () => {
    return (
      <>
        <h5 className="vads-u-font-size--h4">Claimant information</h5>
        <dl className="review">
          <div className="review-row">
            <dt>First name</dt>
            <dd>{data.claimantFullName.first}</dd>
          </div>
          <div className="review-row">
            <dt>Last name</dt>
            <dd>{data.claimantFullName.last}</dd>
          </div>
          <div className="review-row">
            <dt>Social Security number</dt>
            <dd>
              <SSNWidget value={data.claimantSsn} />
            </dd>
          </div>
          <div className="review-row">
            <dt>Date of birth</dt>
            <dd>{format(parseISO(data.claimantDateOfBirth), dateFormat)}</dd>
          </div>
        </dl>
        {renderVeteranInfo(true)}
      </>
    );
  };
  let displayFunc;
  let toPath = '/submit-va-form-21-0966';
  let sectionHeaderText = title;
  switch (title) {
    case 'Claimant background':
      displayFunc = renderIsVeteran;
      toPath += '/claimant-background';
      break;
    case 'Claimant information':
      displayFunc = renderVeteranInfo;
      toPath += '/veteran-information';
      sectionHeaderText = 'Veteran Information';
      break;
    case 'Claimant and Veteran information':
      displayFunc = renderClaimantInfo;
      toPath += '/claimant-information';
      break;
    default:
      break;
  }

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row  vads-u-justify-content--space-between">
          <h4 className="vads-u-margin-top--1 vads-u-font-size--h3">
            {sectionHeaderText}
          </h4>
          <va-button
            text="Edit"
            label={`Edit ${sectionHeaderText}`}
            onClick={() => goToPath(toPath)}
            secondary
          />
        </div>
        {displayFunc()}
      </form>
    </div>
  );
};

RedirectPageReview.propTypes = {
  data: PropTypes.object,
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export { RedirectPageReview }; // named export for testing

export default RedirectPageReview;
