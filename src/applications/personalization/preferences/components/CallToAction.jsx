import React from 'react';
import { connect } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import { eBenefitsUrlGenerator } from 'platform/utilities/eBenefitsUrl';

function CallToAction({ cta, eBenefitUrl }) {
  const { description, link, text, gaTag, isEbenefitUrl } = cta;
  const hasLinkAndText = link && text;
  return (
    <div>
      {description}
      {hasLinkAndText && (
        <a
          className="usa-button va-button-primary"
          href={isEbenefitUrl ? eBenefitUrl(link) : link}
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
}

const mapStateToProps = state => ({
  eBenefitUrl: eBenefitsUrlGenerator(state),
});

export default connect(mapStateToProps)(CallToAction);

export { CallToAction };
