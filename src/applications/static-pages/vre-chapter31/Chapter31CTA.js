import React from 'react';

import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import CallToActionWidget from 'platform/site-wide/cta-widget';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { buildChapter31Content } from './buildChapter31Content';

const Chapter31CTA = props => {
  let content;
  const currentURL = window.location.href.split('/');
  if (props.includedInFlipper === undefined) {
    content = <LoadingIndicator message="Loading..." />;
  } else if (props.includedInFlipper === false) {
    content = buildChapter31Content(currentURL[5]);
  } else {
    content = <div>Hey</div>;
  }
  return <div>{content}</div>;
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.showChapter31],
});

export default connect(mapStateToProps)(Chapter31CTA);
