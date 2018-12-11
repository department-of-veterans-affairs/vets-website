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
        <AlertBox status="warning" headline="Please confirm this change">
          <p>
            We’ll remove this content. If you’d like to see the information
            again, you can always add it back. Just click on the “Find More
            Benefits” button at the top of your dashboard, then select “{title}
            .”
          </p>
          <button
            className="usa-button-primary"
            onClick={() => handleRemove(slug)}
          >
            Remove
          </button>
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
        <button
          className="va-button-link"
          onClick={() => handleViewToggle(slug)}
        >
          <i className="fa fa-close" /> <span>Remove</span>
        </button>
      </div>
      <p className="va-introtext">{introduction}</p>
      <AdditionalInfo
        tagName={'h4'}
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
