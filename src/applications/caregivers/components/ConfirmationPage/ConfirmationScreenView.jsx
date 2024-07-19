import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { focusElement } from '~/platform/utilities/ui';
import scrollToTop from '~/platform/utilities/ui/scrollToTop';
import ApplicationDownloadLink from '../ApplicationDownloadLink';
import { normalizeFullName } from '../../utils/helpers';
import content from '../../locales/en/content.json';
import Abbr from '../Abbreviation';

const ConfirmationScreenView = ({ name, timestamp }) => {
  useEffect(() => {
    focusElement('.caregiver-success-message');
    scrollToTop();
  }, []);

  return (
    <>
      <div className="caregiver-success-message vads-u-margin-bottom--4">
        <va-alert status="success" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            {content['confirmation--alert-heading']}
          </h2>
          <div>{content['confirmation--alert-text']}</div>
        </va-alert>
      </div>

      <va-summary-box class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">{content['confirmation--info-heading']}</h3>

        <h4>{content['confirmation--info-vet-label']}</h4>
        <p data-testid="cg-veteran-fullname">{normalizeFullName(name, true)}</p>

        {timestamp ? (
          <>
            <h4>{content['confirmation--info-timestamp-label']}</h4>
            <p data-testid="cg-submission-date">
              {format(new Date(timestamp), 'MMM. d, yyyy')}
            </p>
          </>
        ) : null}

        <h4>{content['confirmation--print-heading']}</h4>
        <p>
          {content['confirmation--print-text']} <Abbr key="pdf" />.
        </p>

        <div className="vads-u-margin-y--2">
          <va-button
            text={content['button-print']}
            onClick={() => window.print()}
            data-testid="cg-print-button"
          />
        </div>

        <div className="caregiver-application--download">
          <ApplicationDownloadLink />
        </div>
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.number,
};

export default ConfirmationScreenView;
