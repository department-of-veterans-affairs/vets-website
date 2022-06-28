import React from 'react';
import { connect } from 'react-redux';

import { formatReadableDate } from '../helpers';
import { VETERANS_TYPE } from '../constants';

function FryDeaEligibilityCards({ veterans }) {
  if (!veterans) {
    return <></>;
  }

  let earliestDeaDate;
  let earliestFryDate;

  for (const veteran of veterans) {
    if (
      (veteran.deaStartDate && !earliestDeaDate) ||
      veteran.deaStartDate < earliestDeaDate
    ) {
      earliestDeaDate = veteran.deaStartDate;
    }
    if (
      (veteran.fryStartDate && !earliestFryDate) ||
      veteran.fryStartDate < earliestFryDate
    ) {
      earliestFryDate = veteran.fryStartDate;
    }
  }

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
        <p className="vads-u-margin-y--1px">CHAPTER 33</p>
        <h3 className="vads-u-margin-y--1px">Fry Scholarship</h3>
        <p>
          <i className="fas fa-check-circle" aria-hidden="true" /> You may be
          eligible for this benefit
        </p>
        <h4 className="vads-u-font-size--h5">
          Receive up to 36 months of benefits, starting{' '}
          {formatReadableDate(earliestDeaDate)}
        </h4>
        <p>
          <i className="fas fa-school" aria-hidden="true" /> Tuition &amp; fees
        </p>
        <p>
          <i className="fas fa-home" aria-hidden="true" /> Money for housing
        </p>
        <p>
          <i className="fas fa-book" aria-hidden="true" /> Money for books &amp;
          supplies
        </p>
        <a href="https://va.gov/">
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
        <p className="vads-u-margin-y--1px">DEA, CHAPTER 35</p>
        <h3 className="vads-u-margin-y--1px">
          Survivors’ and Dependents’ Educational Assistance
        </h3>
        <p>
          <i className="fas fa-check-circle" aria-hidden="true" /> You may be
          eligible for this benefit
        </p>
        <h4 className="vads-u-font-size--h5">
          Receive up to 45 months of benefits, starting{' '}
          {formatReadableDate(earliestFryDate)}
        </h4>
        <p>
          <i className="fas fa-money-check-alt" aria-hidden="true" /> Monthly
          stipend
        </p>
        <a href="va.gov">Learn more about the DEA education benefit</a>
      </va-alert>
    </>
  );
}

FryDeaEligibilityCards.propTypes = {
  veterans: VETERANS_TYPE,
};

const mapStateToProps = state => ({
  veterans: state.form?.data?.veterans,
});

export default connect(mapStateToProps)(FryDeaEligibilityCards);
