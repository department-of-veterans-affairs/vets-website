import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  updateDependents,
  updatePastMode,
  updateYear,
  updateZipCode,
} from '../actions';
import { ROUTES } from '../constants';
import { customizeTitle } from '../utilities/customize-title';

const HomePage = ({
  router,
  togglePastMode,
  updateDependentsField,
  updateYearField,
  updateZipCodeField,
}) => {
  const H1 = 'Income limits and your VA health care';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  useEffect(
    () => {
      const clearForm = () => {
        updateDependentsField('');
        updateYearField('');
        updateZipCodeField('');
      };

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
      clearForm();
    },
    [router, updateDependentsField, updateYearField, updateZipCodeField],
  );

  const goToCurrent = event => {
    event.preventDefault();
    togglePastMode(false);
    router.push(ROUTES.ZIPCODE);
  };

  const goToPast = event => {
    event.preventDefault();
    togglePastMode(true);
    router.push(ROUTES.YEAR);
  };

  return (
    <>
      <h1>{H1}</h1>
      <p>
        Answer 2 questions to find out how your income may affect your VA health
        care eligibility and costs.
      </p>
      <h2>What to know before you start:</h2>
      <ul className="vads-u-margin-left--1">
        <li>
          Some Veterans are eligible for VA health care no matter their income.
          You may be eligible based on your VA disability rating, service
          history, or other factors. If you think you may be eligible, we
          encourage you to apply anytime.{' '}
          <va-link
            href="/health-care/eligibility/"
            text="Review health care eligibility factors"
          />
        </li>
        <li>
          If you’re not eligible for VA health care based on other factors, you
          may still be eligible based on your income.
        </li>
        <li>
          If your income changes after you&#8217;re enrolled in VA health care,
          you can report the update to us. We&#8217;ll review your current
          income and may adjust your copay costs.
        </li>
        <li>
          You&#8217;ll need information about your{' '}
          {new Date().getFullYear() - 1} household income and deductions to
          check income limits. Limits vary by where you live and change each
          year.
        </li>
      </ul>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <va-link-action
        data-testid="income-limits-current"
        href="#"
        onClick={goToCurrent}
        text="Check current income limits"
      />
      <h2>Past income limits</h2>
      <p>You can also use this tool to review income limits for past years.</p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <va-link-action
        data-testid="income-limits-past"
        href="#"
        onClick={goToPast}
        text="Check income limits for a previous year"
        type="secondary"
      />
    </>
  );
};

const mapStateToProps = state => ({
  pastMode: state?.incomeLimits?.pastMode,
});

const mapDispatchToProps = {
  togglePastMode: updatePastMode,
  updateDependentsField: updateDependents,
  updateYearField: updateYear,
  updateZipCodeField: updateZipCode,
};

HomePage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  togglePastMode: PropTypes.func.isRequired,
  updateDependentsField: PropTypes.func.isRequired,
  updateYearField: PropTypes.func.isRequired,
  updateZipCodeField: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
