import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';

const DisagreeFileClaimPage = ({ goBack }) => (
  <div>
    Disagree file claim!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: 'disagree-file-claim',
  component: DisagreeFileClaimPage,
};
