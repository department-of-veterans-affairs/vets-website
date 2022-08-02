import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// import { VETERANS_TYPE , VETERAN_NOT_LISTED_VALUE } from '../constants';

function FryDeaEligibilityCards(/* { selectedVeteran, veterans } */) {
  // if (
  //   !veterans ||
  //   !selectedVeteran ||
  //   selectedVeteran === VETERAN_NOT_LISTED_VALUE
  // ) {
  //   return <></>;
  // }

  // const veteran = veterans.find(v => v.id === selectedVeteran);

  return (
    <>
      <va-alert
        background-only
        class="vads-u-margin-bottom--2"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        full-width="false"
        status="continue"
        visible="true"
      >
        <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          CHAPTER 33
        </h5>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
          Fry Scholarship
        </h4>

        <p>
          <i
            className="fas fa-check-circle fry-dea-benefit-selection-icon"
            aria-hidden="true"
          />
          You may be eligible for this benefit
        </p>

        <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
          Receive up to 36 months of benefits, including:
        </h4>
        <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
          <li>
            <i
              className="fas fa-school fry-dea-benefit-selection-icon"
              aria-hidden="true"
            />{' '}
            Tuition &amp; fees
          </li>
          <li>
            <i
              className="fas fa-home fry-dea-benefit-selection-icon"
              aria-hidden="true"
            />{' '}
            Money for housing
          </li>
          <li>
            <i
              className="fas fa-book fry-dea-benefit-selection-icon"
              aria-hidden="true"
            />{' '}
            Money for books &amp; supplies
          </li>
        </ul>
        <a
          href="https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about the Fry Scholarship education benefit
        </a>
      </va-alert>

      <va-alert
        background-only
        class="vads-u-margin-bottom--2"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        full-width="false"
        status="continue"
        visible="true"
      >
        <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          DEA, CHAPTER 35
        </h5>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
          Survivors’ and Dependents’ Educational Assistance
        </h4>

        <p>
          <i
            className="fas fa-check-circle vads-u-margin-right--1"
            aria-hidden="true"
          />
          You may be eligible for this benefit
        </p>

        <h4 className="vads-u-font-size--h5 vads-u-margin-bottom--2">
          Receive up to 36 months of benefits, including:
        </h4>
        <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
          <li>
            <i
              className="fas fa-money-check-alt fry-dea-benefit-selection-icon"
              aria-hidden="true"
            />{' '}
            Monthly stipend
          </li>
        </ul>
        <a
          href="https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about the DEA education benefit
        </a>
      </va-alert>
    </>
  );
}

FryDeaEligibilityCards.propTypes = {
  // selectedVeteran: PropTypes.string,
  // veterans: VETERANS_TYPE,
};

export default connect()(FryDeaEligibilityCards);
