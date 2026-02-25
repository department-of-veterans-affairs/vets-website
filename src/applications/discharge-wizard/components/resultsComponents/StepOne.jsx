import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from './AlertMessage';
import { determineBoardObj, determineFormData } from '../../helpers';

import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';
import { DRB } from '../../constants';

const StepOne = ({ formResponses }) => {
  const reason = formResponses[SHORT_NAME_MAP.REASON];
  const specialReason = [
    RESPONSES.REASON_PTSD,
    RESPONSES.REASON_TBI,
    RESPONSES.REASON_SEXUAL_ASSAULT,
  ].includes(reason);
  const boardToSubmit = determineBoardObj(formResponses);

  const reasonsObj = {
    [RESPONSES.REASON_PTSD]: {
      name: 'PTSD or other mental health conditions',
      type: 'condition',
    },
    [RESPONSES.REASON_TBI]: {
      name: 'TBI',
      type: 'condition',
    },
    [RESPONSES.REASON_SEXUAL_ASSAULT]: {
      name: 'sexual assault',
      type: 'experience',
    },
  };

  const strongCaseTips = () => {
    if (specialReason) {
      const { name, type } = reasonsObj[reason];
      return (
        <>
          <p>
            For discharges related to {name}, be sure to answer these questions
            to make the strongest case:
          </p>
          <ul>
            <li>
              Did you have {type === 'experience' ? 'an' : 'a'} {type} that may
              explain or contribute to the discharge?
            </li>
            <li>
              Did that {type}{' '}
              {reason === RESPONSES.REASON_SEXUAL_ASSAULT
                ? 'happen'
                : 'start or get worse'}{' '}
              during your military service?
            </li>
            <li>
              Why does the {type} directly explain or contribute to the
              discharge?
            </li>
            <li>
              Why does the {type} carry more weight than any other reasons you
              may have been discharged for?
            </li>
          </ul>
        </>
      );
    }
    return null;
  };

  const dd214Tips = (
    <ul>
      <li>
        Pay special attention to item 14, which asks for the reason for your
        change. Here you should explain why you need a new DD214, including any
        problems you face when you have to show both the DD214 and the DD215.
        You may want to consider attaching additional pages to fully answer this
        question.
      </li>
    </ul>
  );

  const nonDd2014Tips = (
    <ul>
      <li>
        Pay special attention to item 14, which asks for the reason for your
        change. Most Veterans attach additional pages to answer this question.{' '}
        {strongCaseTips()}
      </li>
      {[
        RESPONSES.PREV_APPLICATION_BCMR,
        RESPONSES.PREV_APPLICATION_BCNR,
      ].includes(formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE]) && (
        <li>
          Because you’re applying for reconsideration of a previous application,
          you’ll need to enter the previous application number in Item 11b.{' '}
          <strong>Note:</strong> You’re generally only eligible for
          reconsideration if you have new evidence to present that wasn’t
          available when you applied last time. Make sure you’re clear about
          exactly what that new evidence is. Additionally, changes in DOD
          policy, like the new consideration guidelines for PTSD, TBI, and
          sexual assault or harassment, can qualify you for reconsideration.
        </li>
      )}
      {formResponses[SHORT_NAME_MAP.REASON] ===
        RESPONSES.REASON_SEXUAL_ASSAULT && (
        <li>
          <strong>Note:</strong> For upgrades related to sexual assault or
          harassment, you do not need to prove the original assault or
          harassment occurred—meaning if you didn’t file charges or report the
          incident, you can still apply for an upgrade. The important part of
          your application is where you explain the impact of the incident on
          your service. For example, detail how the incident caused a decrease
          in your productivity, or was the reason for PTSD.
        </li>
      )}
      {boardToSubmit.abbr !== DRB && (
        <li>
          Item 16 asks for the date when you discovered the error or injustice
          you’re asking the Board to address. If it’s been more than 3 years
          since you found this error or injustice, you’ll need to include a
          reason why the Board should consider your application. Examples of
          good reasons include new evidence you’ve found to support your claim,
          or recent changes in policy (like liberal consideration for PTSD, TBI,
          or military sexual assault or harassment). These kinds of reasons will
          make it more likely for the Board to decide in your favor. The 3-year
          time limit isn’t a strict rule, so don’t let it keep you from applying
          if you think you have a strong case.
        </li>
      )}
      {boardToSubmit.abbr !== DRB && (
        <li>
          Item 17 asks if you’re willing to appear in person before the Board in
          Washington, DC. The Board rarely asks Veterans to appear in person,
          but if you say you’re willing to do so, it may help show how serious
          you are about your case.
        </li>
      )}
      {boardToSubmit.abbr === DRB &&
        formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE] !==
          RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY && (
          <li>
            You can request either a Documentary Review or Personal Appearance
            Review from the Discharge Review Board (DRB). If your case is
            especially complicated and requires detailed explanation, you may
            have more success with a Personal Appearance Review. Note that
            you’ll have to pay your travel costs if you make a personal
            appearance. Documentary Reviews are generally faster, so we
            recommend you begin with this type of review. Also, if you’re denied
            in a Documentary Review, you can then appeal through a Personal
            Appearance Review. But you can’t request Documentary Review after a
            Personal Appearance Review.
          </li>
        )}
      {boardToSubmit.abbr === DRB &&
        formResponses[SHORT_NAME_MAP.PREV_APPLICATION_TYPE] ===
          RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY && (
          <li>
            The DRB allows you to request either a Documentary Review or a
            Personal Appearance Review. Because your application was already
            denied during a Documentary Review, you must apply for a Personal
            Appearance Review in Washington, DC. Note that you will have to pay
            your travel costs if you make a personal appearance.
          </li>
        )}
    </ul>
  );

  const { num: formNumber, link: formLink } = determineFormData(formResponses);
  let formTitle = `Form ${formNumber}`;
  const formFileName = formLink.split('/').pop();
  if ([293, 149].includes(formNumber)) {
    formTitle = `DOD Form ${formNumber}`;
  }

  const header = `Download and fill out DOD Form ${formNumber}`;

  return (
    <va-process-list-item header={header} level="2">
      <p>Important tips for completing {formTitle}:</p>
      {formResponses[SHORT_NAME_MAP.REASON] ===
      RESPONSES.REASON_DD215_UPDATE_TO_DD214
        ? dd214Tips
        : nonDd2014Tips}
      {/* Intentionally not using <va-link> per Platform Analytics team */}
      <va-link
        download
        href={formLink}
        className="vads-u-margin-bottom--1"
        filetype="PDF"
        filename={formFileName}
        text={`Download ${formTitle} (opens in a new tab)`}
        onClick={e => {
          e.preventDefault();
          window.open(formLink, '_blank');
        }}
      />
      <AlertMessage
        content={
          <>
            <h3 className="usa-alert-heading">
              If you need help filling out your form
            </h3>
            <p>
              You can appoint an accredited attorney, claims agent, or Veterans
              Service Organization (VSO) representative.{' '}
              <va-link
                external
                href="/get-help-from-accredited-representative/find-rep"
                text="Get help from an accredited representative"
              />
              .
            </p>
          </>
        }
        isVisible
        status="warning"
      />
    </va-process-list-item>
  );
};

StepOne.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default StepOne;
