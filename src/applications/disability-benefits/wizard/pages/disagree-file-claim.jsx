import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './index';

const DisagreeFileClaimPage = ({ goBack }) => (
  <div>
    Disagree file claim!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
