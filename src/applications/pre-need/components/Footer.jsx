import React from 'react';
import FormFooter from 'platform/forms/components/FormFooter';

const Footer = ({ formConfig, currentLocation }) => (
  <div className="row">
    {currentLocation.pathname === '/introduction'}
    <FormFooter formConfig={formConfig} currentLocation={currentLocation} />
  </div>
);

export default Footer;
