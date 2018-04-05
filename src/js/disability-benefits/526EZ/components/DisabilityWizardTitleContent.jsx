import React from 'react';
import PropTypes from 'prop-types';

export default function TitleContent(props) {
  const { atGuidance, checkGuidanceStatus } = props;
  const { atAppealGuidance, atIncreaseGuidance } = checkGuidanceStatus();
  let titleContent = 'You need to file a disability claim on eBenefits';
  if (!atGuidance()) titleContent = 'What type of disability claim should I file?';
  if (atAppealGuidance) titleContent = 'You need to file an appeal';
  if (atIncreaseGuidance) titleContent = 'You need to file a claim for increase';
  return <h3>{titleContent}</h3>;
}

TitleContent.propTypes = {
  checkGuidanceStatus: PropTypes.func.isRequired,
  atGuidance: PropTypes.func.isRequired
};
