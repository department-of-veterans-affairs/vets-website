import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const BenefitCard = ({ benefit }) => {
  const {
    name,
    category,
    description,
    isTimeSensitive,
    learnMoreURL,
    applyNowURL,
  } = benefit;

  const handleClick = (url, text, label) => {
    return recordEvent({
      event: 'nav-link-click',
      'link-label': text,
      'link-destination': url,
      'link-origin': label,
    });
  };

  const renderLink = (url, text, label, action = false) => {
    if (url) {
      return action === true ? (
        <va-link-action
          href={url}
          text={text}
          label={label}
          type="secondary"
          disable-analytics
          onClick={() => {
            handleClick(url, text, label);
          }}
        />
      ) : (
        <va-link
          active
          href={url}
          text={text}
          label={label}
          disable-analytics
          onClick={() => {
            handleClick(url, text, label);
          }}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="benefit-card vads-u-margin-bottom--2"
      data-testid={`benefit-card-${benefit.name}`}
    >
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
        <div className="link-container">
          <div className="vads-u-margin-right--2 vads-u-margin-bottom--1">
            {renderLink(
              learnMoreURL,
              'Learn more',
              `Learn more about ${name}`,
              false,
            )}
          </div>
          <div>
            {renderLink(
              applyNowURL,
              'Apply now',
              `Apply now for ${name}`,
              true,
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
