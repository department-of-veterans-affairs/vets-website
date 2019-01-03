import React from 'react';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const CallToAction = ({ cta }) => {
  const { description, link, text } = cta;
  const hasLinkAndText = link && text;
  return (
    <div>
      {description}
      {hasLinkAndText && (
        <a className="usa-button va-button-primary" href={link}>
          {text}
        </a>
      )}
    </div>
  );
};

const FAQItem = ({ faq }) => {
  const { title, component: FAQComponent } = faq;
  return (
    <AdditionalInfo
      tagName={'h5'}
      additionalClass="benefit-faq"
      triggerText={title}
    >
      <FAQComponent />
    </AdditionalInfo>
  );
};

const FAQList = ({ faqs }) => (
  <div>
    {faqs.map((faq, idx) => (
      <FAQItem faq={faq} key={idx} />
    ))}
  </div>
);

export default function PreferenceItem({
  handleViewToggle,
  handleRemove,
  isRemoving,
  benefit,
}) {
  const { title, introduction, code, cta, faqs } = benefit;

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
            onClick={() => handleRemove(code)}
          >
            Remove
          </button>
          <button
            className="usa-button-secondary"
            onClick={() => handleViewToggle(code)}
          >
            Cancel
          </button>
        </AlertBox>
      </div>
    );
  }
  return (
    <div>
      <div className="title-container preference-item-title">
        <h3>{title}</h3>
        <button
          className="va-button-link"
          onClick={() => handleViewToggle(code)}
        >
          <i className="fa fa-close" /> <span>Remove</span>
        </button>
      </div>
      <p className="va-introtext">{introduction}</p>
      {faqs && <FAQList faqs={faqs} />}
      {cta && <CallToAction cta={cta} />}
    </div>
  );
}

PreferenceItem.propTypes = {
  handleViewToggle: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool.isRequired,
  benefit: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    introduction: PropTypes.string,
    alert: PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
    }),
    faqs: PropTypes.array,
    cta: PropTypes.shape({
      description: PropTypes.element,
      link: PropTypes.string,
      text: PropTypes.string,
    }),
  }),
};
