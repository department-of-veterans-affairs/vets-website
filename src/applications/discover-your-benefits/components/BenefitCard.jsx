import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const BenefitCard = ({ benefit, isBenefitRecommended }) => {
  const { name, category, description, learnMoreURL } = benefit;

  const handleClick = (url, text, label) => {
    return recordEvent({
      event: 'nav-link-click',
      'link-label': text,
      'link-destination': url,
      'link-origin': label,
    });
  };

  const renderLink = (url, text, label) => {
    if (url) {
      return (
        <va-link
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
        {isBenefitRecommended(benefit.id) && (
          <span className="usa-label recommended-label">
            RECOMMENDED FOR YOU
          </span>
        )}
        <p
          className={`category-eyebrow ${
            !isBenefitRecommended(benefit.id) ? 'vads-u-margin-top--neg0p5' : ''
          }`}
        >
          {category}
        </p>
        <h3 aria-label={name} className="vads-u-margin-top--0">
          {name}
        </h3>
        <p className="vads-u-margin-y--0 vads-u-margin-bottom--neg0p5">
          {description}
        </p>
        <h4 className="vads-u-margin-bottom--neg1">When to apply</h4>
        <p className="vads-u-margin-bottom--neg0p5">
          {benefit.whenToApplyDescription}
        </p>
        {benefit.whenToApplyNote !== undefined && (
          <p>
            <b>Note</b>: {benefit.whenToApplyNote}
          </p>
        )}
        <div className="link-container">
          <div className="vads-u-margin-right--2 vads-u-margin-bottom--1">
            {renderLink(learnMoreURL, 'Learn more', `Learn more about ${name}`)}
          </div>
        </div>
      </va-card>
    </div>
  );
};

BenefitCard.propTypes = {
  benefit: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    learnMoreURL: PropTypes.string,
    name: PropTypes.string,
    whenToApplyDescription: PropTypes.string,
    whenToApplyNote: PropTypes.string,
  }),
  isBenefitRecommended: PropTypes.func,
};

export default BenefitCard;
