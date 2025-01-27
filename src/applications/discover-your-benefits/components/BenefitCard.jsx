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

  const renderLink = (url, text, label) => {
    if (url) {
      return (
        <va-link
          href={url}
          text={text}
          label={label}
          type="secondary"
          external
        />
      );
    }
    return null;
  };

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
          <div className="vads-u-margin-right--2">
            {renderLink(learnMoreURL, 'Learn more', `Learn more about ${name}`)}
          </div>
          <div>
            {renderLink(applyNowURL, 'Apply now', `Apply now for ${name}`)}
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
