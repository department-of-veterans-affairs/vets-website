import React from 'react';
import { EVIDENCE_PRIVATE_REQUEST } from '../constants';
import { title4142 } from './title';
import BasicLink from '../../shared/components/web-component-wrappers/BasicLink';

export const authorizationLabel =
  'I acknowledge and authorize this release of information';

export const authorizationAlertContent = onAnchorClick => (
  <>
    <h3 slot="headline">
      Authorize your doctor to release your records or upload them yourself
    </h3>
    <p className="vads-u-margin-bottom--0">
      If you want us to request your non-VA medical records from your doctor,
      you must authorize the release.
    </p>
    <va-link
      disable-analytics
      href="#privacy-agreement"
      onClick={onAnchorClick}
      id="checkbox-anchor"
      text="Check box to authorize"
    />
    <p className="vads-u-margin-bottom--0">
      Or, go back a page and select <strong>No</strong> where we ask about
      non-VA medical records. Then you can upload your records or submit a
      21-4142 and 21-4142a after submitting this form.
    </p>
    <BasicLink
      disableAnalytics
      path={`/${EVIDENCE_PRIVATE_REQUEST}`}
      text="Go back to upload records"
    />
  </>
);

export const authorizationHeader = <h3>{title4142}</h3>;

export const authorizationError =
  'You must give us authorization for us to get your non-VA medical records';
