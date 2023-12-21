import { VaBackToTop } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import LastUpdatedAndFeedback from './LastUpdatedAndFeedback';
import NeedHelp from './NeedHelp';

const Footer = () => {
  return (
    <div className="row ">
      <div className="usa-width-two-thirds medium-8 columns">
        <NeedHelp />
        <VaBackToTop />
        <LastUpdatedAndFeedback />
      </div>
    </div>
  );
};

export default Footer;
