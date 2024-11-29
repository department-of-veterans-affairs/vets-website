import React from 'react';
import PropTypes from 'prop-types';

import BenefitCard from '../../components/BenefitCard';
import NoResultsBanner from '../../components/NoResultsBanner';

const Benefits = ({
  benefits,
  benefitsList,
  benefitIds,
  handleClick,
  results,
  queryString,
}) => {
  return (
    <>
      <div>
        {results.isLoading && (
          <va-loading-indicator label="Loading" message="Loading results..." />
        )}

        {!results.isLoading &&
          benefits.length > 0 && (
            <ul className="benefit-list">
              {benefits.map(benefit => (
                <li key={benefit.id}>
                  <BenefitCard
                    benefit={benefit}
                    className="vads-u-margin-bottom--2"
                  />
                </li>
              ))}
            </ul>
          )}

        {!queryString.allBenefits &&
          !results.isLoading &&
          benefits.length === 0 && (
            <NoResultsBanner data={results.data} handleClick={handleClick} />
          )}
      </div>
      {queryString.allBenefits &&
        benefitsList.length > 0 && (
          <ul className="benefit-list">
            {benefitsList.map(
              benefit =>
                !benefitIds[benefit.id] && (
                  <li key={benefit.id}>
                    <BenefitCard
                      benefit={benefit}
                      className="vads-u-margin-bottom--2"
                    />
                  </li>
                ),
            )}
          </ul>
        )}
    </>
  );
};

Benefits.propTypes = {
  results: PropTypes.shape({
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    data: PropTypes.array,
    error: PropTypes.object,
  }),
};

export default Benefits;
