import React from 'react';
import PropTypes from 'prop-types';

import BenefitCard from '../../components/BenefitCard';

const Benefits = ({ benefitsList, benefitIds }) => {
  return (
    <>
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
    </>
  );
};

Benefits.propTypes = {
  benefitsList: PropTypes.array,
  benefitIds: PropTypes.object || PropTypes.array,
  queryString: PropTypes.shape({
    allBenefits: PropTypes.string,
  }),
};

export default Benefits;
