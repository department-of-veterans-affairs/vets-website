// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { invoke } from 'lodash';
// Relative imports.
import { capitalize } from '../../helpers';

const SearchResult = ({ school }) => (
  <div className="medium-screen:vads-l-col vads-l-col vads-u-background-color--gray-light-alt vads-u-margin-bottom--2 vads-u-padding-x--3 vads-u-padding-y--2">
    {/* School Name */}
    <h3 className="vads-u-margin--0">{capitalize(school?.name)}</h3>

    {/* School Location */}
    <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
      {capitalize(school?.city)}, {school?.state}
    </p>

    <div className="vads-l-row vads-u-margin-top--2">
      <div className="vads-l-col--6 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between">
        {/* Max Benefit Amount */}
        <div className="vads-u-col">
          <h4 className="vads-u-font-size--h5 vads-u-margin--0">
            Maximum Yellow Ribbon benefit amount
          </h4>
          <p className="vads-u-margin--0">
            {invoke(school?.tuitionOutOfState, 'toLocaleString', 'en-US', {
              currency: 'USD',
              style: 'currency',
            }) || 'Unknown'}
          </p>
        </div>

        {/* Benefit available for x students */}
        <h4 className="vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
          Benefit available for
        </h4>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {school?.studentCount
            ? `${school?.studentCount} students`
            : 'Unknown'}
        </p>

        {/* Add to Compare */}
        <div>
          <button
            className="usa-button-secondary vads-u-background-color--white vads-u-margin--0 vads-u-font-size--md"
            onClick={() => {}}
          >
            <i className="fas fa-plus vads-u-padding-right--1" />
            Add to compare
          </button>
        </div>
      </div>

      <div className="vads-l-col--6 vads-u-padding-left--2">
        {/* Degree Level */}
        <h4 className="vads-u-font-size--h5 vads-u-margin--0">Degree level</h4>
        <p className="vads-u-margin--0">{school?.highestDegree || 'Unknown'}</p>

        {/* School or Division */}
        <h4 className="vads-u-font-size--h5 vads-u-margin--0 vads-u-margin-top--2">
          School or division
        </h4>
        <p className="vads-u-margin--0">Unknown</p>
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
