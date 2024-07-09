import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  formFields,
  VETERANS_TYPE,
  VETERAN_NOT_LISTED_VALUE,
} from '../constants';

const eligibleMessage = (
  <p>
    <va-icon
      // className="fas fa-check-circle fry-dea-benefit-selection-icon"
      icon="check_circle"
      size={3}
    />{' '}
    You may be eligible for this benefit
  </p>
);
const notEligibleMessage = (
  <p>
    <va-icon
      // className="fas fa-exclamation-circle vads-u-margin-right--1"
      icon="error"
      size={3}
    />{' '}
    You’re not eligible for this benefit
  </p>
);

function FryDeaEligibilityCards({ selectedVeteran, veterans }) {
  // if (
  //   !veterans ||
  //   !selectedVeteran ||
  //   selectedVeteran === VETERAN_NOT_LISTED_VALUE
  // ) {
  //   return <></>;
  // }

  const veteran =
    selectedVeteran && selectedVeteran !== VETERAN_NOT_LISTED_VALUE
      ? veterans.find(v => v.id === selectedVeteran)
      : null;

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

        {veteran &&
          (veteran.fryEligibility ? eligibleMessage : notEligibleMessage)}

        <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
          Receive up to 36 months of benefits, including:
        </h4>
        <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
          <li>
            <va-icon
              //  className="fas fa-school fry-dea-benefit-selection-icon"
              icon="school"
              size={3}
            />{' '}
            Tuition &amp; fees
          </li>
          <li>
            <va-icon
              // className="fas fa-home fry-dea-benefit-selection-icon"
              icon="home"
              size={3}
            />{' '}
            Money for housing
          </li>
          <li>
            <va-icon
              //   className="fas fa-book fry-dea-benefit-selection-icon"
              icon="local_library"
              size={3}
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

        {veteran &&
          (veteran.deaEligibility ? eligibleMessage : notEligibleMessage)}

        <h4 className="vads-u-font-size--h5 vads-u-margin-bottom--2">
          Receive up to 36 months of benefits, including:
        </h4>
        <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
          <li>
            <va-icon
              //   className="fas fa-money-check-alt fry-dea-benefit-selection-icon"
              icon="attach_money"
              size={3}
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
  selectedVeteran: PropTypes.string,
  veterans: VETERANS_TYPE,
};

const mapStateToProps = state => ({
  selectedVeteran: state.form?.data[formFields.selectedVeteran],
  formData: state.form?.data || {},
  veterans: state.form?.data?.veterans,
});

export default connect(mapStateToProps)(FryDeaEligibilityCards);
