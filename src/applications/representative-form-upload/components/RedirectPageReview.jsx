import React from 'react';
import PropTypes from 'prop-types';

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
  const { data, goToPath } = props;

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

  const renderVeteranInfo = () => {
    return (
      <>
        <h5>Veteran information</h5>
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
            <dd>{data.veteranSsn}</dd> {/* todo need to obscure */}
          </div>
          <div className="review-row">
            <dt>Date of birth</dt>
            <dd>{data.veteranDateOfBirth}</dd>{' '}
            {/* todo need to format mm-dd-yyyy */}
          </div>
          <div className="review-row">
            <dt>VA file number</dt>
            <dd>{data.vaFileNumber}</dd> {/* todo need to obscure */}
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
        <h5>Claimant information</h5>
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
            <dd>{data.claimantSsn}</dd> {/* todo need to obscure */}
          </div>
          <div className="review-row">
            <dt>Date of birth</dt>
            <dd>{data.claimantDateOfBirth}</dd>{' '}
            {/* todo need to format mm-dd-yyyy */}
          </div>
        </dl>
        {renderVeteranInfo()}
      </>
    );
  };
  let displayFunc;
  let toPath = '/submit-va-form-21-0966';
  let sectionHeaderText = props.title;
  switch (props.title) {
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
          <h4 className="vads-u-margin-top--1">{sectionHeaderText}</h4>
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
