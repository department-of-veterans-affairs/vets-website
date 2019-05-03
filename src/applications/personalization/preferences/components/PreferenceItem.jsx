import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CallToAction = ({ cta }) => {
  const { description, link, text, gaTag } = cta;
  const hasLinkAndText = link && text;
  return (
    <div>
      {description}
      {hasLinkAndText && (
        <a
          className="usa-button va-button-primary"
          href={link}
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-button',
              'dashboard-product': gaTag,
            })
          }
        >
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

export default class PreferenceItem extends React.Component {
  constructor(props) {
    super(props);

    this.removeBtnRef = React.createRef();
    this.alertHeaderRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    // Set focus for keyboard-users upon content-swap.
    if (!prevProps.isRemoving && this.props.isRemoving) {
      this.alertHeaderRef.current.focus();
    } else if (prevProps.isRemoving && !this.props.isRemoving) {
      this.removeBtnRef.current.focus();
    }
  }

  onCancelRemove(code) {
    this.removeCancelled = true;
    this.props.handleViewToggle(code);
  }

  render() {
    const { title, introduction, code, cta, faqs } = this.props.benefit;

    if (this.props.isRemoving) {
      return (
        <div>
          <h3 ref={this.alertHeaderRef} className="benefit-title" tabIndex="-1">
            {title}
          </h3>
          <AlertBox status="warning" headline="Please confirm this change">
            <p>
              We’ll remove this content. If you’d like to see the information
              again, you can always add it back. Just click on the “Find More
              Benefits” button at the top of your dashboard, then select “
              {title}
              .”
            </p>
            <button
              className="usa-button-primary"
              onClick={() => this.props.handleRemove(code)}
            >
              Remove
            </button>
            <button
              className="usa-button-secondary"
              onClick={() => this.onCancelRemove(code)}
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
            ref={this.removeBtnRef}
            className="va-button-link"
            aria-label={`Remove ${title} preference`}
            onClick={() => this.props.handleViewToggle(code)}
          >
            <i className="fas fa-times" /> <span>Remove</span>
          </button>
        </div>
        <p className="va-introtext">{introduction}</p>
        {faqs && <FAQList faqs={faqs} />}
        {cta && <CallToAction cta={cta} />}
      </div>
    );
  }
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
