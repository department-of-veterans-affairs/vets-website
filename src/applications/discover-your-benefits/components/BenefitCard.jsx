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
      <va-card>
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
              <a
                href={learnMoreURL}
                rel="noreferrer"
                className="link--center"
                aria-label={`Learn more about ${name}`}
                target="_blank"
              >
                Learn more (opens in a new tab)
                <span className="usa-sr-only">opens in a new tab</span>
              </a>
            )}
          </div>
          <div className="vads-u-display--inline-block">
            {applyNowURL && (
              <a
                href={applyNowURL}
                rel="noreferrer"
                className="link--center"
                aria-label={`Apply now for ${name}`}
                target="_blank"
              >
                Apply now (opens in a new tab)
                <span className="usa-sr-only">opens in a new tab</span>
              </a>
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
