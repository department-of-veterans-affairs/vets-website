import React from 'react';
import PropTypes from 'prop-types';

const BenefitCard = ({ benefit }) => {
  const { name, category, description, learnMoreURL, applyNowURL } = benefit;
  return (
    <div className="vads-u-margin-bottom--2">
      <va-card tabIndex="0">
        <h3>
          <span className="usa-label">{category}</span>
          <br />
          <br />
          <span>{name}</span>
        </h3>
        <p className="vads-u-margin-y--0">{description}</p>
        <div>
          <div className="vads-u-display--inline-block vads-u-margin-right--2">
            {learnMoreURL && (
              <va-link-action
                href={learnMoreURL}
                text="Learn more"
                type="secondary"
                label={`Learn more about ${name}`}
              />
            )}
          </div>
          <div className="vads-u-display--inline-block">
            {applyNowURL && (
              <va-link-action
                href={applyNowURL}
                text="Apply now"
                type="secondary"
                label={`Apply now for ${name}`}
              />
            )}
          </div>
        </div>
      </va-card>
    </div>
  );
};

BenefitCard.propTypes = {
  benefit: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    learnMoreURL: PropTypes.string,
    applyNowURL: PropTypes.string,
  }),
};

export default BenefitCard;
