import React from 'react';
import NotificationCTA from '../NotificationCTA';

const HealthCareCard = ({ type, cardProperties, noActiveData }) => {
  let cardTitle = cardProperties?.cardTitle;
  let line1 = cardProperties?.line1;
  let line2 = cardProperties?.line2;
  let line3 = cardProperties?.line3;
  let sectionTitle = cardProperties?.sectionTitle;

  const CTA = {
    text: cardProperties?.ctaText,
    icon: cardProperties?.ctaIcon,
    href: cardProperties?.ctaHref,
    ariaLabel: cardProperties?.ctaAriaLabel,
  };

  if (type === 'messages') {
    cardTitle = 'Latest Message';
    line1 = 'From: Dr. Susan Smith';
    line2 = 'Date: January 22nd, 2021';
    line3 = 'Subject: We received your most recent lab results ...';
    sectionTitle = 'Messages';
    CTA.icon = 'envelope';
    CTA.text = 'You have 2 unread messages';
    CTA.href = '';
    CTA.ariaLabel = 'View your unread messages';
  }

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
