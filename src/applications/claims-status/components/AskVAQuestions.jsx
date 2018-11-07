import React from 'react';
import CallVBACenter from '../../../platform/brand-consolidation/components/CallVBACenter';

function AskVAQuestions(props) {
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>
          {props.children}
          <p className="help-talk">
            To report a problem with this form,
            <br />
            please <CallVBACenter />
          </p>
        </div>
      </div>
    </div>
  );
}

export default AskVAQuestions;
