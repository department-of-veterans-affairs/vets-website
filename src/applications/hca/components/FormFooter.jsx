import React from 'react';

export default class FormFooter extends React.Component {
  render() {
    const { formConfig, currentLocation } = this.props;
    const GetFormHelp = formConfig.getHelp;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');

    if (isConfirmationPage) {
      return null;
    }

    return (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <div className="help-footer-box">
            <h2 className="help-heading">Need help?</h2>
            <GetFormHelp />
          </div>
        </div>
      </div>
    );
  }
}
