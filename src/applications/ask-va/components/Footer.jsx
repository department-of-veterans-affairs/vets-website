import { VaBackToTop } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import NeedHelp from './NeedHelp';

const Footer = () => {
  return (
    <div className="row ">
      <div className="usa-width-two-thirds medium-8 columns">
        <NeedHelp />
        <VaBackToTop />
      </div>
    </div>
  );
};

export default Footer;
