import React from 'react';
import NotificationCTA from '../NotificationCTA';

const HealthCareCard = ({ cardProperties, noActiveData }) => {
  const cardTitle = cardProperties?.cardTitle;
  const line1 = cardProperties?.line1;
  const line2 = cardProperties?.line2;
  const line3 = cardProperties?.line3;
  const sectionTitle = cardProperties?.sectionTitle;

  const CTA = {
    text: cardProperties?.ctaText,
    icon: cardProperties?.ctaIcon,
    href: cardProperties?.ctaHref,
    ariaLabel: cardProperties?.ctaAriaLabel,
  };

  const standardClass =
    'vads-u-padding-y--2p5 vads-u-padding-x--2p5 vads-u-flex--fill';
  const backgroundClasses = noActiveData
    ? standardClass
    : `vads-u-background-color--gray-lightest ${standardClass}`;

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 medium-screen:vads-u-padding-right--3">
      {/* Title */}
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        {sectionTitle}
      </h3>

      {/* Content */}
      <div className={backgroundClasses}>
        <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
          {cardTitle}
        </h4>
        <p>{line1}</p>
        {!noActiveData && (
          <>
            <p>{line2}</p>
            <p className="vads-u-margin-bottom--0">{line3}</p>
          </>
        )}
      </div>

      {/* CTA */}
      <NotificationCTA CTA={CTA} />
    </div>
  );
};

export default HealthCareCard;
