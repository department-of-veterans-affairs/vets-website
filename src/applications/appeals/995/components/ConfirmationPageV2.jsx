import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { resetStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { selectProfile } from 'platform/user/selectors';

import { title995 } from '../content/title';

import {
  housingRiskTitle,
  livingSituationTitle,
  livingSituationList,
  otherHousingRisksLabel,
  pointOfContactNameLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';
import {
  VaContent,
  PrivateContent,
  UploadContent,
} from './EvidenceSummaryLists';

import { content as notice5103Content } from '../content/notice5103';
import { facilityTypeTitle, facilityTypeList } from '../content/facilityTypes';
import { content as evidenceContent } from '../content/evidenceSummary';
import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
} from '../utils/evidence';

import {
  ConfirmationTitle,
  ConfirmationAlert,
  ConfirmationSummary,
  ConfirmationReturnLink,
} from '../../shared/components/ConfirmationCommon';
import ConfirmationPersonalInfo from '../../shared/components/ConfirmationPersonalInfo';
import ConfirmationIssues from '../../shared/components/ConfirmationIssues';
import { showValueOrNotSelected } from '../../shared/utils/confirmation';
import { SC_NEW_FORM_DATA } from '../constants';

export const ConfirmationPageV2 = () => {
  resetStoredSubTask();

  const form = useSelector(state => state.form || {});
  const profile = useSelector(state => selectProfile(state));

  // Fix this after Lighthouse sets up the download URL
  const downloadUrl = ''; // SC_PDF_DOWNLOAD_URL;

  const { data = {} } = form;

  const vaEvidence = getVAEvidence(data);
  const privateEvidence = getPrivateEvidence(data);
  const otherEvidence = getOtherEvidence(data);
  const noEvidence =
    vaEvidence.length + privateEvidence.length + otherEvidence.length === 0;
  const showScNewForm = data[SC_NEW_FORM_DATA];

  return (
    <>
      <ConfirmationTitle pageTitle={title995} />
      <ConfirmationAlert alertTitle="Thank you for filing a Supplemental Claim">
        <p>
          After we’ve completed our review, we’ll mail you a decision packet
          with the details of our decision.
        </p>
      </ConfirmationAlert>

      <ConfirmationSummary
        name="Supplemental Claim"
        downloadUrl={downloadUrl}
      />

      <h2>What to expect next</h2>
      <p>
        If we need more information, we’ll contact you to tell you what other
        information you’ll need to submit. We’ll also tell you if we need to
        schedule an exam for you.
      </p>
      <p>
        When we’ve completed your review, we’ll mail you a decision packet with
        the details of our decision.{' '}
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
      </p>
      <p>
        If you requested a decision review and haven’t heard back from us yet,
        please don’t request another review. Call us instead.
      </p>
      <p>
        Note: You can choose to have a hearing at any point in the claims
        process. Contact us online through Ask VA to request a hearing.{' '}
        <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
      </p>
      <p>
        You can also call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />{' '}
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>

      <p>
        <va-link-action
          href="/claim-or-appeal-status/"
          text="Check the status of your claim"
        />
      </p>

      <p>
        <strong>Note:</strong> It may take 7 to 10 days for your Supplemental
        Claim request to appear online.
      </p>

      <h2 className="vads-u-margin-top--4">Your Supplemental Claim request</h2>

      <ConfirmationPersonalInfo
        dob={profile.dob}
        userFullName={profile.userFullName}
        veteran={data.veteran}
        hasHomeAndMobilePhone
        hasLivingSituationChapter
      />

      {showScNewForm && (
        <>
          <h3 className="vads-u-margin-top--2">Living situation</h3>
          {/* Adding a `role="list"` to `ul` with `list-style: none` to work
              around a problem with Safari not treating the `ul` as a list. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="remove-bullets" role="list">
            <li>
              <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                {housingRiskTitle}
              </div>
              <div
                className="vads-u-margin-bottom--2 dd-privacy-hidden"
                data-dd-action-name="has housing risk"
              >
                {showValueOrNotSelected(data.housingRisk)}
              </div>
            </li>
            {data.housingRisk && (
              <>
                <li>
                  <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                    {livingSituationTitle}
                  </div>
                  <div
                    className="vads-u-margin-bottom--2 dd-privacy-hidden"
                    data-dd-action-name="living situation"
                  >
                    {livingSituationList(data?.livingSituation) ||
                      'None selected'}
                  </div>
                </li>
                {data.livingSituation?.other && (
                  <li>
                    <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                      {otherHousingRisksLabel}
                    </div>
                    <div
                      className="vads-u-margin-bottom--2 dd-privacy-hidden"
                      data-dd-action-name="other housing risks"
                    >
                      {data.otherHousingRisks || 'Nothing entered'}
                    </div>
                  </li>
                )}
                <li>
                  <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                    {pointOfContactNameLabel}
                  </div>
                  <div
                    className="vads-u-margin-bottom--2 dd-privacy-hidden"
                    data-dd-action-name="point of contact full name"
                  >
                    {data.pointOfContactName || 'Nothing entered'}
                  </div>
                </li>
                <li>
                  <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
                    {pointOfContactPhoneLabel}
                  </div>
                  <div
                    className="vads-u-margin-bottom--2 dd-privacy-hidden"
                    data-dd-action-name="point of contact phone number"
                  >
                    {data.pointOfContactPhone ? (
                      <va-telephone
                        contact={data.pointOfContactPhone}
                        extension={data.pointOfContactPhone?.extension}
                        not-clickable
                      />
                    ) : (
                      'Nothing entered'
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>
        </>
      )}

      <ConfirmationIssues data={data} />

      <h3 className="vads-u-margin-top--2">New and relevant evidence</h3>
      {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
          a problem with Safari not treating the `ul` as a list. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="remove-bullets" role="list">
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {notice5103Content.label}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="notice 5103 reviewed"
          >
            {data.form5103Acknowledged
              ? 'Yes, I certify'
              : 'No, I didn’t certify'}
          </div>
        </li>

        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {facilityTypeTitle}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="facility types selected"
          >
            {facilityTypeList(data.facilityTypes) || 'None selected'}
          </div>
        </li>
      </ul>

      {noEvidence && (
        <>
          <h3 className="vads-u-margin-top--2">
            {evidenceContent.summaryTitle}
          </h3>
          <div>{evidenceContent.missingEvidenceReviewText}</div>
        </>
      )}

      {vaEvidence.length ? (
        <VaContent
          list={vaEvidence}
          reviewMode
          showListOnly
          showScNewForm={showScNewForm}
        />
      ) : null}

      {privateEvidence.length ? (
        <PrivateContent
          list={privateEvidence}
          limitedConsent={data.limitedConsent}
          reviewMode
          showListOnly
          showScNewForm={showScNewForm}
        />
      ) : null}

      {otherEvidence.length ? (
        <UploadContent
          list={otherEvidence}
          reviewMode
          showListOnly
          showScNewForm={showScNewForm}
        />
      ) : null}

      <ConfirmationReturnLink />
    </>
  );
};

ConfirmationPageV2.propTypes = {
  children: PropTypes.element,
  form: PropTypes.shape({
    data: PropTypes.shape({}),
    formId: PropTypes.string,
  }),
};

export default ConfirmationPageV2;
