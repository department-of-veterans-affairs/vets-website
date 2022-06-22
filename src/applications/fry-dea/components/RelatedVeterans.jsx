import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formatReadableDate } from '../helpers';

function RelatedVeterans({ veterans }) {
  const veteranList = veterans?.map((veteran, index) => {
    return (
      <li
        key={`sponsor-${index}`}
        className="fry-dea-form-featured-content vads-u-margin-top--2"
      >
        <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          VETERAN OR SERVICE MEMBER {index + 1}
        </h5>
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {veteran.name}
        </h4>
        <dl className="fry-dea-definition-list">
          <dt className="fry-dea-definition-list_term">Date of birth:</dt>
          <dd className="fry-dea-definition-list_definition">
            {formatReadableDate(veteran.dateOfBirth)}
          </dd>
          <dt className="fry-dea-definition-list_term">
            Your relationship to sponsor:
          </dt>
          <dd className="fry-dea-definition-list_definition">
            {veteran.relationship}
          </dd>
        </dl>
        <h5 className="vads-u-margin-top--1 vads-u-padding-top--1 vads-u-border-top--1px vads-u-border-color--base">
          Associated benefits you may be elibible for:
        </h5>
        <ul className="vads-u-margin--0 vads-u-padding-left--2">
          {veteran.fryEligibility > 0 && (
            <li>
              Up to {veteran.fryEligibility}{' '}
              {veteran.fryEligibility === 1 ? 'month' : 'months'} of Fry
              Scholarship (Chapter 33)
            </li>
          )}
          {veteran.deaEligibility > 0 && (
            <li>
              Up to {veteran.deaEligibility}{' '}
              {veteran.deaEligibility === 1 ? 'month' : 'months'} of Survivors’
              and Dependents Educational Assistance (DEA, Chapter 35)
            </li>
          )}
        </ul>
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
  veterans: state.form?.data?.veterans,
});

export default connect(mapStateToProps)(RelatedVeterans);
