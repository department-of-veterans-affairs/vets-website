import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import ApplicationDownloadLink from '../ApplicationDownloadLink';
import { normalizeFullName } from '../../utils/helpers';
import content from '../../locales/en/content.json';
import Abbr from '../Abbreviation';

const ConfirmationScreenView = ({ name, route, timestamp }) => {
  const veteranFullName = useMemo(() => normalizeFullName(name, true), [name]);
  const submissionDate = useMemo(
    () => (timestamp ? format(new Date(timestamp), 'MMM. d, yyyy') : null),
    [timestamp],
  );

  useEffect(() => {
    focusElement('va-alert[status="success"]');
    scrollToTop();
  }, []);

  return (
    <>
      <va-alert status="success" class="vads-u-margin-bottom--4">
        <h2 slot="headline" className="vads-u-font-size--h3">
          {content['confirmation--alert-heading']}
        </h2>
        <div>{content['confirmation--alert-text']}</div>
      </va-alert>

      <va-summary-box class="vads-u-margin-bottom--4">
        <h3 slot="headline">{content['confirmation--info-heading']}</h3>

        <h4>{content['confirmation--info-vet-label']}</h4>
        <p data-testid="cg-veteran-fullname">{veteranFullName}</p>

        {submissionDate && (
          <>
            <h4>{content['confirmation--info-timestamp-label']}</h4>
            <p data-testid="cg-submission-date">{submissionDate}</p>
          </>
        )}

        <h4>{content['confirmation--print-heading']}</h4>
        <p>
          {content['confirmation--print-text']} <Abbr abbrKey="pdf" />.
        </p>

        <div className="vads-u-margin-y--2">
          <va-button
            text={content['button-print']}
            onClick={() => window.print()}
            data-testid="cg-print-button"
          />
        </div>

        <div className="caregiver-application--download">
          <ApplicationDownloadLink formConfig={route.formConfig} />
        </div>
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  timestamp: PropTypes.number,
};

export default ConfirmationScreenView;
