import React from 'react';
import PropTypes from 'prop-types';
import { serviceStatuses } from '../constants';

const DocumentsNeeded = props => {
  const { hasOneTimeRestoration, formData } = props;

  const requiredDocumentMessages = {
    [serviceStatuses.VETERAN]: (
      <>
        {hasOneTimeRestoration ? (
          <>
            <p>you’ll need to upload these documents:</p>
            <ul>
              <li>
                A copy of your discharge or separation papers (DD214) showing
                character of service
              </li>
              <li>Evidence of a VA loan was paid in full (if applicable)</li>
            </ul>
          </>
        ) : (
          <p>
            you’ll need to upload a copy of your discharge or separation papers
            (DD214) showing character of service.
          </p>
        )}
      </>
    ),
    [serviceStatuses.ADSM]: (
      <>
        {formData?.militaryHistory?.purpleHeartRecipient ||
        hasOneTimeRestoration ? (
          <>
            <p>you’ll need to upload these documents:</p>
            <ul>
              <li>Statement of Service</li>
              {formData?.militaryHistory?.purpleHeartRecipient && (
                <li>A copy of your Purple Heart certificate</li>
              )}
              {hasOneTimeRestoration && (
                <li>Evidence of a VA loan was paid in full (if applicable)</li>
              )}
            </ul>
          </>
        ) : (
          <p>you’ll need to upload a Statement of Service.</p>
        )}
      </>
    ),
    [serviceStatuses.NADNA]: (
      <>
        <p>you’ll need to upload these documents:</p>
        <ul>
          <li>Statement of Service</li>
          <li>
            Creditable number of years served <strong>or</strong> Retirement
            Points Statement or equivalent
          </li>
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
    [serviceStatuses.DNANA]: (
      <>
        <p>you’ll need to upload these documents:</p>
        <ul>
          <li>
            Separation and Report of Service (NGB Form 22) for each period of
            National Guard service
          </li>
          <li>Retirement Points Accounting (NGB Form 23)</li>
          <li>
            Proof of character of service such as a DD214 <strong>or</strong>{' '}
            Department of Defense Discharge Certificate
          </li>
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
    [serviceStatuses.DRNA]: (
      <>
        <p>you’ll need to upload these documents:</p>
        <ul>
          <li>Retirement Point Accounting</li>
          <li>
            Proof of honorable service for at least six years such as a DD214 or
            Department of Defense Discharge Certificate
          </li>
          {hasOneTimeRestoration && (
            <li>Evidence of a VA loan was paid in full (if applicable)</li>
          )}
        </ul>
      </>
    ),
  };

  return requiredDocumentMessages[formData.identity];
};

DocumentsNeeded.propTypes = {
  formData: PropTypes.object,
  hasOneTimeRestoration: PropTypes.bool,
};

export default DocumentsNeeded;
