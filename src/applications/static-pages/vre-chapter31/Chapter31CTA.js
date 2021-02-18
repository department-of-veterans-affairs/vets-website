import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import Chapter31Content from './buildChapter31Content';

const Chapter31CTA = props => {
  let content;
  const currentURL = window.location.href.split('/');
  // If the page is loading, show a loading indicator
  // If the user is NOT included in flipper, build the content for the page based on parts of the URL
  // else if the user IS included in flipper, show them the button that leads to the Chapter 31 form on VA.gov
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    recordEvent({
      event: 'phased-roll-out-disabled',
      'product-description': 'Chapter 31',
    });
    content = <Chapter31Content page={currentURL[5]} track={currentURL[6]} />;
  } else {
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'Chapter 31',
    });
    content = (
      <>
        <a
          href="/careers-employment/vocational-rehabilitation/apply"
          className="usa-button-primary va-button-primary"
        >
          Apply for Veteran Readiness and Employment
        </a>
      </>
    );
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter31],
});

export default connect(mapStateToProps)(Chapter31CTA);
