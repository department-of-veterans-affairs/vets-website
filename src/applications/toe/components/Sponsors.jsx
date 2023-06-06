import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatReadableDate } from '../helpers';

function Sponsors({ sponsors }) {
  const sponsorsList = sponsors?.map((sponsor, index) => {
    return (
      <li
        key={`sponsor-${index}`}
        className="toe-form-featured-content vads-u-margin-top--2"
      >
        <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          SPONSOR {index + 1}
        </h5>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {sponsor.name}
        </h4>
        <dl className="toe-definition-list">
          <dt className="toe-definition-list_term">Date of birth:</dt>
          <dd className="toe-definition-list_definition">
            {formatReadableDate(sponsor.dateOfBirth)}
          </dd>
          <dt className="toe-definition-list_term">Relationship:</dt>
          <dd className="toe-definition-list_definition">
            {sponsor.relationship}
          </dd>
        </dl>
      </li>
    );
  });

  return (
    <ul className="toe-sponsors vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-padding--0">
      {sponsorsList}
    </ul>
  );
}

Sponsors.propTypes = {
  sponsors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.string,
      relationship: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  sponsors: state.form?.data?.sponsors?.sponsors || [],
});

export default connect(mapStateToProps)(Sponsors);
