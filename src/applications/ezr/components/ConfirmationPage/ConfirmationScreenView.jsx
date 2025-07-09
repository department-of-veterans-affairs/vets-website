import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { useSelector } from 'react-redux';
import ApplicationDownloadLink from '../ApplicationDownloadLink';
import content from '../../locales/en/content.json';

const ConfirmationScreenView = ({ name, timestamp }) => {
  useEffect(() => {
    focusElement('.ezr-success-message');
    scrollToTop();
  }, []);

  const { data: formData } = useSelector(state => state.form);

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

      <va-summary-box class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">{content['confirm-app-title']}</h3>

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
              {format(new Date(timestamp), 'MMM. d, yyyy')}
            </p>
          </>
        ) : null}

        <h4>{content['confirm-app-list-confirm']}</h4>
        <p>{content['confirm-app-list-print']}</p>

        <div className="vads-u-margin-y--2">
          <va-button
            text={content['button-print']}
            onClick={() => window.print()}
            data-testid="ezr-print-button"
            uswds
          />
        </div>
        {formData['view:isDownloadPdfEnabled'] && (
          <div className="ezr-application--download">
            <ApplicationDownloadLink
              linkText={content['button-pdf-download']}
            />
          </div>
        )}
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
