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
      'vads-l-col',
      'vads-u-background-color--gray-light-alt',
      'vads-u-margin-bottom--2',
      'vads-u-padding-x--3',
      'vads-u-padding-y--2',
    )}
  >
    {/* School Name */}
    <h3 className={classnames('vads-u-margin--0')}>
      {capitalize(school?.name)}
    </h3>

    {/* School Location */}
    <p
      className={classnames('vads-u-margin-bottom--1', 'vads-u-margin-top--0')}
    >
      {capitalize(school?.city)}, {school?.state}
    </p>

    <div className="vads-l-row vads-u-margin-top--2">
      <div
        className={classnames(
          'vads-l-col--6',
          'vads-u-display--flex',
          'vads-u-flex-direction--column',
          'vads-u-justify-content--space-between',
        )}
      >
        {/* Max Benefit Amount */}
        <div className="vads-u-col">
          <h4 className={classnames('vads-u-font-size--h5 vads-u-margin--0')}>
            Maximum Yellow Ribbon benefit amount
          </h4>
          <p className={classnames('vads-u-margin--0')}>
            {invoke(school?.tuitionOutOfState, 'toLocaleString', 'en-US', {
              currency: 'USD',
              style: 'currency',
            })}
          </p>
        </div>

        {/* Add to Compare */}
        <button
          className="usa-button-secondary vads-u-background-color--white vads-u-margin--0"
          onClick={() => {}}
        >
          <i className="fas fa-plus vads-u-padding-right--1" />
          Add to Compare
        </button>
      </div>

      <div className={classnames('vads-l-col--6 vads-u-padding-left--2')}>
        {/* Benefit available for x students */}
        <h4 className={classnames('vads-u-font-size--h5 vads-u-margin--0')}>
          Benefit available for
        </h4>
        <p className={classnames('vads-u-margin--0')}>
          {school?.studentCount} students
        </p>

        {/* Degree Level */}
        <h4
          className={classnames(
            'vads-u-font-size--h5 vads-u-margin--0 vads-u-margin-top--1',
          )}
        >
          Degree level
        </h4>
        <p className={classnames('vads-u-margin--0')}>
          {school?.highestDegree}
        </p>

        {/* School or Division */}
        <h4
          className={classnames(
            'vads-u-font-size--h5 vads-u-margin--0 vads-u-margin-top--1',
          )}
        >
          School or division
        </h4>
        <p className={classnames('vads-u-margin--0')}>All</p>
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
};

export default SearchResult;
