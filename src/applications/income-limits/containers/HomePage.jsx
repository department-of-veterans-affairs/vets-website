import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import {
  updateDependents,
  updatePastMode,
  updateYear,
  updateZipCode,
} from '../actions';
import { ROUTES } from '../constants';

const HomePage = ({
  router,
  togglePastMode,
  updateDependentsField,
  updateYearField,
  updateZipCodeField,
}) => {
  useEffect(
    () => {
      const clearForm = () => {
        updateDependentsField('');
        updateYearField('');
        updateZipCodeField('');
      };

      waitForRenderThenFocus('h1');
      scrollToTop();
      clearForm();
    },
    [updateDependentsField, updateYearField, updateZipCodeField],
  );

  const goToCurrent = () => {
    togglePastMode(false);
    router.push(ROUTES.ZIPCODE);
  };

  const goToPast = () => {
    togglePastMode(true);
    router.push(ROUTES.YEAR);
  };

  return (
    <>
      <h1>Home Page</h1>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        data-testid="income-limits-current"
        href="#"
        className="vads-u-display--block vads-u-margin-bottom--1"
        onClick={goToCurrent}
      >
        Current income limits
      </a>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        data-testid="income-limits-past"
        href="#"
        className="vads-u-display--block"
        onClick={goToPast}
      >
        Past income limits
      </a>
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
