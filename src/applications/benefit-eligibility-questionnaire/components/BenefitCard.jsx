import React from 'react';
import PropTypes from 'prop-types';

const BenefitCard = ({ benefit }) => {
  const {
    name,
    category,
    description,
    isTimeSensitive,
    learnMoreURL,
    applyNowURL,
  } = benefit;
  return (
    <div className="benefit-card vads-u-margin-bottom--2">
      <va-card tabIndex="0">
        <>
          {isTimeSensitive && (
            <div className="blue-heading">
              <span>
                <b>Time-sensitive benefit</b>
              </span>
            </div>
          )}
        </>
        <h3 className="vads-u-margin-top--0">
          <span className="usa-label category-label">{category}</span>
          <br />
          <br />
          <span>{name}</span>
        </h3>
        <p className="vads-u-margin-y--0">{description}</p>
        <div>
          <div className="vads-u-display--inline-block vads-u-margin-right--2">
            {learnMoreURL && (
              <va-link
                href={learnMoreURL}
                external
                text="Learn more"
                type="secondary"
                label={`Learn more about ${name}`}
              />
            )}
          </div>
          <div className="vads-u-display--inline-block">
            {applyNowURL && (
              <va-link
                href={applyNowURL}
                external
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
    applyNowURL: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    isTimeSensitive: PropTypes.bool,
    learnMoreURL: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default BenefitCard;
