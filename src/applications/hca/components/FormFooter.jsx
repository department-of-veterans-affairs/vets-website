import React from 'react';
import CallHRC from 'platform/brand-consolidation/components/CallHRC';

export default class FormFooter extends React.Component {
  render() {
    const { formConfig, currentLocation } = this.props;
    const GetFormHelp = formConfig.getHelp;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');

    return (
      <div>
        {!isConfirmationPage && (
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns">
              <div className="help-footer-box">
                <h2 className="help-heading">Need help?</h2>
                <GetFormHelp />
                <p className="help-talk">
                  To report a problem with this form,
                  <br />
                  please <CallHRC />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
