import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';
import environment from '~/platform/utilities/environment';

// a component to render the dev tools and provide any
// additional functions needed for development
// can be removed when the feature is complete / uat is done
// ignoring for istanbul because its not for use in production
/* istanbul ignore next */
export const DirectDepositDevWidget = ({ debugData }) => {
  const dataToRender = pick(debugData.controlInformation, [
    'canUpdateDirectDeposit',
    'isCorpAvailable',
    'isEduClaimAvailable',
  ]);

  const handlers = {
    onClick: () => {
      // fill the form with dummy data
      debugData?.setFormData({
        accountType: 'Checking',
        routingNumber: '123456789',
        accountNumber: '987654321',
      });
    },
  };

  return (
    <DevTools devToolsData={debugData}>
      <div>
        <p>Debug direct deposit information - for development purposes only</p>
        <ul className="vads-u-font-size--sm">
          {Object.entries(dataToRender).map(([key, value]) => (
            <li key={key}>
              {key}:{' '}
              <span
                className={`usa-label ${
                  value
                    ? 'vads-u-background-color--green'
                    : 'vads-u-background-color--secondary'
                }`}
              >
                {value.toString()}
              </span>
            </li>
          ))}
        </ul>
        {environment.isLocalhost() && (
          <va-button text="Auto fill form" onClick={handlers.onClick} />
        )}
      </div>
    </DevTools>
  );
};

DirectDepositDevWidget.propTypes = {
  debugData: PropTypes.object,
};
