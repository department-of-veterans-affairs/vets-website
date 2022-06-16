import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatReadableDate } from '../helpers';

function RelatedVeterans({ veterans }) {
  const veteranList = veterans?.map((veteran, index) => {
    return (
      <li
        key={`sponsor-${index}`}
        className="toe-form-featured-content vads-u-margin-top--2"
      >
        <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          SPONSOR {index + 1}
        </h5>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {veteran.name}
        </h4>
        <dl className="toe-definition-list">
          <dt className="toe-definition-list_term">Date of birth:</dt>
          <dd className="toe-definition-list_definition">
            {formatReadableDate(veteran.dateOfBirth)}
          </dd>
          <dt className="toe-definition-list_term">
            Your relationship to sponsor:
          </dt>
          <dd className="toe-definition-list_definition">
            {veteran.relationship}
          </dd>
        </dl>
      </li>
    );
  });

  return (
    <ul className="fry-dea-veterans vads-u-margin-top--3 vads-u-margin-bottom--4 vads-u-padding--0">
      {veteranList}
    </ul>
  );
}

RelatedVeterans.propTypes = {
  veterans: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.string,
      relationship: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  veterans: state.form?.data?.veterans || [],
});

export default connect(mapStateToProps)(RelatedVeterans);
