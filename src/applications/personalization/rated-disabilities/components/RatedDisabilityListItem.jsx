import React from 'react';
import PropTypes from 'prop-types';

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const {
    decisionText,
    ratingPercentage,
    name,
    effectiveDate,
    relatedTo,
  } = ratedDisability;
  return (
    <div className="rated-disability-item-container">
      <table>
        <tbody>
          <tr>
            <td>Disability</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td>Decision</td>
            <td>{decisionText}</td>
          </tr>
          <tr>
            <td>Related to</td>
            <td>{relatedTo}</td>
          </tr>
          <tr>
            <td>Effective Date</td>
            <td>{effectiveDate}</td>
          </tr>
          <tr>
            <td>Decision</td>
            <td>{ratingPercentage}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RatedDisabilityListItem;

RatedDisabilityListItem.propTypes = PropTypes.object;
