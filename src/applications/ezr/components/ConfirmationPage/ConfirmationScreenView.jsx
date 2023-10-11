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
        <va-alert status="success" uswds>
          <h2 slot="headline">{content['confirm-success-title']}</h2>
          <div>
            <p className="vads-u-margin-top--0">
              {content['confirm-success-review-message']}
            </p>
            <p className="vads-u-margin-bottom--0">
              {content['confirm-success-changes-message']}
            </p>
          </div>
        </va-alert>
      </div>

      <va-alert status="info" class="vads-u-margin-bottom--4" background-only>
        <h3 className="vads-u-margin-bottom--2">
          {content['confirm-app-title']}
        </h3>

        <h4>{content['confirm-app-list-name']}</h4>
        <p
          className="ezr-veteran-fullname dd-privacy-mask"
          data-dd-action-name="Full name"
        >
          {name}
        </p>

        {timestamp ? (
          <>
            <h4>{content['confirm-app-list-date']}</h4>
            <p className="ezr-submission-date">
              {moment(timestamp).format('MMM D, YYYY')}
            </p>
          </>
        ) : null}

        <h4>{content['confirm-app-list-confirm']}</h4>
        <p>{content['confirm-app-list-print']}</p>

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
