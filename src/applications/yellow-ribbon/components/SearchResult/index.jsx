// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { includes } from 'lodash';
// Relative imports.
import { capitalize } from '../../helpers';
import {
  addSchoolToCompareAction,
  removeSchoolFromCompareAction,
} from '../../actions';

const deriveNameLabel = school => {
  // Show unknown if there's no name.
  if (!school?.name) {
    return 'Unknown';
  }

  // Show the name.
  return capitalize(school?.name);
};

const deriveLocationLabel = (school = {}) => {
  // Show unknown if there's no city or state.
  if (!school?.city && !school?.state) {
    return 'Unknown';
  }

  // Only show state if there's no city.
  if (!school?.city) {
    return school?.state;
  }

  // Only show city if there's no state.
  if (!school?.state) {
    return capitalize(school?.city);
  }

  // Show both city and state.
  return `${capitalize(school?.city)}, ${school?.state}`;
};

const deriveMaxAmountLabel = (school = {}) => {
  // Show unknown if there's no tuitionOutOfState.
  if (!school?.tuitionOutOfState) {
    return 'Unknown';
  }

  // Show formatted tuitionOutOfState.
  return school?.tuitionOutOfState.toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
  });
};

const deriveEligibleStudentsLabel = (school = {}) => {
  // Show unknown if there's no studentCount.
  if (!school?.studentCount) {
    return 'Unknown';
  }

  // Show studentCount.
  return `${school?.studentCount} students`;
};

const deriveDegreeLevelLabel = (school = {}) => {
  // Show unknown if there's no highestDegree.
  if (!school?.highestDegree) {
    return 'Unknown';
  }

  // Show highest degree.
  return school?.highestDegree;
};

const deriveProgramLabel = () => 'Unknown';

export const SearchResult = ({
  addSchoolToCompare,
  removeSchoolFromCompare,
  school,
  schoolIDs,
}) => (
  <div
    className={classNames(
      'medium-screen:vads-l-col',
      'vads-l-col',
      'vads-u-margin-bottom--1',
      'vads-u-padding-x--3',
      'vads-u-padding-y--2',
      'vads-u-background-color--gray-light-alt',
      'vads-u-border--3px',
      {
        'vads-u-border-color--primary': includes(schoolIDs, school?.id),
        'vads-u-border-color--transparent': !includes(schoolIDs, school?.id),
      },
    )}
  >
    {/* School Name */}
    <h3 className="vads-u-margin--0">{deriveNameLabel(school)}</h3>

    {/* School Location */}
    <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
      {deriveLocationLabel(school)}
    </p>

    <div className="vads-l-row vads-u-margin-top--2">
      <div className="vads-l-col--6 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between">
        {/* Max Benefit Amount */}
        <div className="vads-u-col">
          <h4 className="vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin--0">
            Maximum Yellow Ribbon benefit amount
          </h4>
          <p className="vads-u-margin--0">{deriveMaxAmountLabel(school)}</p>
        </div>

        {/* Benefit available for x students */}
        <h4 className="vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          Benefit available for
        </h4>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {deriveEligibleStudentsLabel(school)}
        </p>

        <div>
          {/* Remove from Comparison. */}
          {includes(schoolIDs, school?.id) ? (
            <button
              className="usa-button-secondary vads-u-background-color--primary vads-u-color--white vads-u-margin--0 vads-u-font-size--md"
              onClick={() => removeSchoolFromCompare(school)}
            >
              <i className="fas fa-check vads-u-padding-right--1" />
              Added
            </button>
          ) : (
            // Add to Comparison.
            <button
              className="usa-button-secondary vads-u-background-color--white vads-u-margin--0 vads-u-font-size--md"
              onClick={() => addSchoolToCompare(school)}
            >
              <i className="fas fa-plus vads-u-padding-right--1" />
              Add to compare
            </button>
          )}
        </div>
      </div>

      <div className="vads-l-col--6 vads-u-padding-left--2">
        {/* Degree Level */}
        <h4 className="vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin--0">
          Degree level
        </h4>
        <p className="vads-u-margin--0">{deriveDegreeLevelLabel(school)}</p>

        {/* School or Program */}
        <h4 className="vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin--0 vads-u-margin-top--2">
          School or program
        </h4>
        <p className="vads-u-margin--0">{deriveProgramLabel(school)}</p>
      </div>
    </div>
  </div>
);

SearchResult.propTypes = {
  school: PropTypes.shape({
    city: PropTypes.string.isRequired,
    highestDegree: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    studentCount: PropTypes.number.isRequired,
    tuitionOutOfState: PropTypes.number.isRequired,
  }).isRequired,
  // From mapStateToProps.
  schoolIDs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  // From mapDispatchToProps.
  addSchoolToCompare: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  schoolIDs: state.yellowRibbonReducer.schoolIDs,
});

const mapDispatchToProps = dispatch => ({
  addSchoolToCompare: school => dispatch(addSchoolToCompareAction(school)),
  removeSchoolFromCompare: school =>
    dispatch(removeSchoolFromCompareAction(school)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResult);
