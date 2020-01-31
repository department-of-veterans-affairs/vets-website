// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

export const ComparisonBanner = ({ schoolIDs }) => {
  // Do not render if there are no selected schoolIDs.
  if (isEmpty(schoolIDs)) {
    return null;
  }

  return (
    <div className="vads-c-promo-banner vads-u-background-color--green vads-u-padding-y--1">
      <div className="vads-c-promo-banner__body">
        <div className="vads-c-promo-banner__content vads-u-text-align--center">
          <a
            className="vads-c-promo-banner__content-link vads-u-font-family--serif vads-u-text-decoration--underline vads-u-font-weight--normal vads-u-font-size--lg vads-u-color--white"
            href="#"
          >
            Compare {schoolIDs.length} selected schools{' '}
            <i className="fas fa-chevron-right" />
          </a>
        </div>
      </div>
    </div>
  );
};

ComparisonBanner.propTypes = {
  // From mapStateToProps.
  schoolIDs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const mapStateToProps = state => ({
  schoolIDs: state.yellowRibbonReducer.schoolIDs,
});

export default connect(
  mapStateToProps,
  null,
)(ComparisonBanner);
