import React from 'react';

const Footer = ({ formConfig, currentLocation }) => (
  <div className="row">
    {currentLocation.pathname === '/introduction'}
    <FormFooter formConfig={formConfig} currentLocation={currentLocation} />
  </div>
);

function FormFooter({ formConfig }) {
  const GetFormHelp = formConfig.getHelp;

  if (!GetFormHelp) {
    return null;
  }

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>
          <div>
            <GetFormHelp formConfig={formConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
