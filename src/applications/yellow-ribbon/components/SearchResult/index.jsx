// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { invoke } from 'lodash';
// Relative imports.
import { capitalize } from '../../helpers';

const SearchResult = ({ school }) => (
  <div
    className={classnames(
      'medium-screen:vads-l-col',
      'vads-l-row',
      'vads-u-background-color--gray-light-alt',
      'vads-u-margin-bottom--1',
      'vads-u-margin-right--1',
      'vads-u-padding--1',
    )}
  >
    <div className={classnames('vads-l-col--8')}>
      {/* School Name */}
      <h3 className={classnames('vads-u-margin--0')}>
        {capitalize(school?.name)}
      </h3>

      {/* School Location */}
      <p
        className={classnames(
          'vads-u-margin-bottom--1',
          'vads-u-margin-top--0',
        )}
      >
        {capitalize(school?.city)}, {school?.state}
      </p>

      {/* Max Benefit Amount */}
      <h3 className={classnames('vads-u-margin--0')}>
        {invoke(school?.tuitionOutOfState, 'toLocaleString', 'en-US', {
          currency: 'USD',
          style: 'currency',
        })}
      </h3>
      <p className={classnames('vads-u-margin--0')}>Maximum Benefit Amount</p>

      {/* Add to Compare */}
      <button className="usa-button-secondary" onClick={() => {}}>
        <i className="fas fa-plus vads-u-padding-right--1" />
        Add to Compare
      </button>
    </div>

    <div className={classnames('vads-l-col--4')}>
      {/* Benefit available for x students */}
      <h4 className={classnames('vads-u-margin--0')}>Benefit Available For</h4>
      <p className={classnames('vads-u-margin--0')}>
        {school?.studentCount} students
      </p>

      {/* Degree Level */}
      <h4 className={classnames('vads-u-margin--0')}>Degree Level</h4>
      <p className={classnames('vads-u-margin--0')}>{school?.highestDegree}</p>

      {/* School or Division */}
      <h4 className={classnames('vads-u-margin--0')}>School or Division</h4>
      <p className={classnames('vads-u-margin--0')}>All</p>
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
};

export default SearchResult;
