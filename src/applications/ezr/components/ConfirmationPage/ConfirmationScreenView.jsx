import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import content from '../../locales/en/content.json';

const ConfirmationScreenView = ({ name, timestamp }) => {
  useEffect(() => {
    focusElement('.ezr-success-message');
    scrollToTop();
  }, []);

  return (
    <>
      <div className="ezr-success-message vads-u-margin-bottom--4">
        <va-alert status="success">
          <h2 slot="headline" className="vads-u-font-size--h3">
            {content['confirm-page-title']}
          </h2>
          <div>{content['confirm-page-description']}</div>
        </va-alert>
      </div>

      <va-alert status="info" class="vads-u-margin-bottom--4" background-only>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2">
          {content['confirm-app-title']}
        </h2>
        <dl>
          <div className="vads-u-margin-bottom--2">
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              {content['confirm-app-list-name']}
            </dt>
            <dd className="ezr-veteran-fullname">{name}</dd>
          </div>
          {timestamp ? (
            <div className="ezr-application-date vads-u-margin-bottom--2">
              <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
                {content['confirm-app-list-date']}
              </dt>
              <dd>{moment(timestamp).format('MMM D, YYYY')}</dd>
            </div>
          ) : null}
          <div>
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              {content['confirm-app-list-confirm']}
            </dt>
            <dd>{content['confirm-app-list-print']}</dd>
          </div>
        </dl>

        <div className="vads-u-margin-top--2">
          <va-button
            text={content['button-print']}
            onClick={() => window.print()}
            data-testid="ezr-print-button"
          />
        </div>
      </va-alert>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
