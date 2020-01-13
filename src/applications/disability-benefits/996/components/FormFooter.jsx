import React from 'react';

import { OptOutFooter } from '../content/OptOutOfOldAppeals';

export default class FormFooter extends React.Component {
  render() {
    const { formConfig, currentLocation } = this.props;
    const GetFormHelp = formConfig.getHelp;

    if (
      !GetFormHelp ||
      currentLocation?.pathname?.replace(/\/$/, '').endsWith('confirmation')
    ) {
      return null;
    }

    // The opt out step has a unique design.
    const optOutPath = formConfig.chapters.step1.pages.optOutOfOldAppeals.path;
    const isOptOutPage = currentLocation?.pathname?.includes(optOutPath);

    return (
      <div className="row" role="presentation">
        <div className="usa-width-two-thirds medium-8 columns">
          <div className="help-footer-box">
            {isOptOutPage ? (
              <OptOutFooter />
            ) : (
              <>
                <h2 className="help-heading">Need help?</h2>
                <GetFormHelp />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
