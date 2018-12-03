import React from 'react';
import { Link } from 'react-router';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function PreferenceItem({
  handleViewToggle,
  handleRemove,
  isRemoving,
  benefit,
}) {
  const {
    title,
    introduction,
    slug,
    ctaLink,
    ctaText,
    faqTitle,
    faqComponent: FAQComponent,
  } = benefit;

  if (isRemoving) {
    return (
      <div>
        <h3 className="benefit-title">{title}</h3>
        <AlertBox status="warning" headline="Confirm your change">
          <p>
            This will remove the {title} block from your dashboard. You can
            always add it back later by clicking the Find More VA Benefits
            button and selecting "{title}
            ".
          </p>
          <button onClick={() => handleRemove(slug)}>Remove</button>
          <button
            className="usa-button-secondary"
            onClick={() => handleViewToggle(slug)}
          >
            Cancel
          </button>
        </AlertBox>
      </div>
    );
  }
  return (
    <div>
      <div className="title-container va-nav-linkslist-heading">
        <h3>{title}</h3>
        <button onClick={() => handleViewToggle(slug)}>Remove</button>
      </div>
      <p className="va-introtext">{introduction}</p>
      <AdditionalInfo
        isHeading
        additionalClass="benefit-faq"
        triggerText={faqTitle}
      >
        <FAQComponent />
      </AdditionalInfo>
      <Link className="usa-button" to={ctaLink}>
        {ctaText}
      </Link>
    </div>
  );
}
