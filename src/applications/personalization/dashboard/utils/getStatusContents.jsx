import React from 'react';
import { addDays, format } from 'date-fns';
import _ from 'lodash';
import * as Sentry from '@sentry/browser';
import { Link } from 'react-router';

import Decision from '../components/claims-and-appeals/Decision';
import {
  getAojDescription,
  getDocketName,
  getHearingType,
  STATUS_TYPES,
  DECISION_REVIEW_URL,
  APPEAL_TYPES,
} from './appeals-helpers';

/**
 * Grabs the matching title and dynamically-generated description for a given current status type
 * @typedef {Object} Contents
 * @property {string} title a current status type's title
 * @property {HTMLElement} description details about the current status, can be any element
 * ----------------------------------------------------------------------------------------------
 * @typedef {Object} Name
 * @property {string} [first] first name
 * @property {string} [middle] middle name
 * @property {string} [last] last
 * @param {Object} appeal
 * @param {Name} [name] used for death status type, includes first/middle/last properties
 * @returns {Contents}
 */
export function getStatusContents(appeal, name = {}) {
  const { status, aoj, programArea } = appeal.attributes;
  const appealType = appeal.type;
  const statusType = status.type || status;
  const details = status.details || {};
  const amaDocket = _.get(appeal, 'attributes.docket.type');
  const aojDescription = getAojDescription(aoj);

  const contents = {};
  switch (statusType) {
    case STATUS_TYPES.pendingSoc:
      contents.title = 'A Decision Review Officer is reviewing your appeal';
      contents.description = (
        <p>
          The {aojDescription} received your Notice of Disagreement. A Decision
          Review Officer (DRO) will review all of the evidence related to your
          appeal, including any new evidence you sent. The DRO may contact you
          to ask for more evidence or medical exams as needed. When the DRO has
          completed their review, they’ll determine whether or not they can
          grant your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.pendingForm9: {
      const formattedSocDate = format(
        addDays(new Date(details.lastSocDate), 1),
        'MMMM d, yyyy',
      );
      contents.title = 'Please review your Statement of the Case';
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a Statement of the Case on{' '}
            {formattedSocDate}. The Statement of the Case explains the reasons
            why they couldn’t fully grant your appeal.
          </p>
          <p>
            You’ll have to take one of these actions within 60 days from the
            date on the Statement of the Case:
          </p>
          <ul>
            <li>
              Submit VA Form 9 to continue your appeal to the Board of Veterans’
              Appeals, <strong>or</strong>
            </li>
            <li>
              <a href={DECISION_REVIEW_URL}>
                Opt in to the new decision review process
              </a>
            </li>
          </ul>
        </div>
      );
      break;
    }
    case STATUS_TYPES.pendingCertification:
      contents.title =
        'The Decision Review Officer is finishing their review of your appeal';
      contents.description = (
        <p>
          The {aojDescription} received your VA Form 9 and will send your appeal
          to the Board of Veterans’ Appeals. But first, the Decision Review
          Officer must certify that they have finished reviewing all of the
          evidence related to your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.pendingCertificationSsoc: {
      const formattedSocDate = format(
        addDays(new Date(details.lastSocDate), 1),
        'MMMM d, yyyy',
      );
      contents.title = 'Please review your Supplemental Statement of the Case';
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a Supplemental Statement of the Case
            on {formattedSocDate}. This is because one or both of these is true:
          </p>
          <ul>
            <li>
              You, your legal representative, your health care provider, or VA
              added new evidence to your appeal and asked VA to review it before
              certifying to the Board
            </li>
            <li>
              VA determined it needed to provide you with more help to develop
              your appeal, such as helping you get treatment records or giving
              you a physical exam if needed.
            </li>
          </ul>
        </div>
      );
      break;
    }
    case STATUS_TYPES.remandSsoc: {
      const formattedSocDate = format(
        addDays(new Date(details.lastSocDate), 1),
        'MMMM d, yyyy',
      );
      contents.title = 'Please review your Supplemental Statement of the Case';
      contents.description = (
        <p>
          The {aojDescription} sent you a Supplemental Statement of the Case on{' '}
          {formattedSocDate} because, after completing the remand instructions
          from the Board, they couldn’t fully grant your appeal.
        </p>
      );
      break;
    }
    case STATUS_TYPES.pendingHearingScheduling:
      contents.title = 'You’re waiting for your hearing to be scheduled';
      contents.description = (
        <div>
          <p>
            You requested a {getHearingType(details.type)} hearing. We'll
            schedule your hearing, and, you’ll receive a notice in the mail at
            least 30 days before the hearing date.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> If you have new evidence, you can only
              submit it at your hearing or within the 90 days after your
              hearing. Please don’t submit additional evidence now.
            </p>
          )}
        </div>
      );
      break;
    case STATUS_TYPES.scheduledHearing: {
      const formattedDate = format(
        addDays(new Date(details.date), 1),
        'MMMM d, yyyy',
      );
      contents.title = 'Your hearing has been scheduled';
      contents.description = (
        <div>
          <p>
            Your {getHearingType(details.type)} hearing is scheduled for{' '}
            {formattedDate} at {details.location}.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> If you have new evidence, you can only
              submit it at your hearing or within the 90 days after your
              hearing. Please don’t submit additional evidence now.
            </p>
          )}
        </div>
      );
      break;
    }
    case STATUS_TYPES.onDocket:
      contents.title = 'Your appeal is waiting to be sent to a judge';
      contents.description = (
        <div>
          <p>
            Your appeal is at the Board of Veterans’ Appeals, waiting to be sent
            to a Veterans Law Judge. Staff at the Board will make sure your case
            is complete, accurate, and ready to be decided by a judge.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> Please don’t submit additional evidence.
              The judge will only consider evidence that VA already has.
            </p>
          )}
        </div>
      );
      break;
    case STATUS_TYPES.atVso:
      contents.title = 'Your appeal is with your Veterans Service Organization';
      contents.description = (
        <p>
          {details.vsoName} is reviewing your appeal to make additional
          arguments in support of your case. For more information, please
          contact {details.vsoName}.
        </p>
      );
      break;
    case STATUS_TYPES.decisionInProgress:
      contents.title = 'A judge is reviewing your appeal';
      contents.description = (
        <p>
          Your appeal is at the Board of Veterans’ Appeals being reviewed by a
          Veterans Law Judge.{' '}
          {appealType === APPEAL_TYPES.legacy &&
            'If you submit evidence that isn’t already included in your case, it may delay your appeal.'}
        </p>
      );
      break;
    case STATUS_TYPES.bvaDevelopment:
      contents.title =
        'The judge is seeking more information before making a decision';
      contents.description = (
        <p>
          The Board of Veterans’ Appeals is seeking evidence or an outside
          opinion from a legal, medical, or other professional in order to make
          a decision about your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.stayed:
      contents.title =
        'The Board is waiting until a higher court makes a decision';
      contents.description = (
        <p>
          A higher court has asked the Board of Veterans’ Appeals to hold open a
          group of appeals awaiting review. Yours is one of the appeals held
          open. The higher court believes that a decision it will make on a
          different appeal could affect yours.
        </p>
      );
      break;
    case STATUS_TYPES.remand:
    case STATUS_TYPES.amaRemand:
    case STATUS_TYPES.bvaDecision:
      contents.title = 'The Board made a decision on your appeal';
      contents.description = (
        <div>
          <p>
            The Board of Veterans’ Appeals sent you a decision on your appeal.
            Here’s an overview:
          </p>
          <Decision
            issues={details.issues}
            aoj={aoj}
            ama={appealType === APPEAL_TYPES.appeal}
            boardDecision
          />
        </div>
      );
      break;
    case STATUS_TYPES.fieldGrant:
      contents.title = `The ${aojDescription} granted your appeal`;
      contents.description = (
        <p>
          The {aojDescription} agreed with you and decided to overturn the
          original decision. If this decision changes your disability rating or
          eligibility for VA benefits, you should see this change made in 1 to 2
          months.
        </p>
      );
      break;
    case STATUS_TYPES.withdrawn:
      contents.title = 'You withdrew your appeal';
      contents.description = (
        <p>
          You chose not to continue your appeal. If this information is
          incorrect, please contact your Veterans Service Organization or
          representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.ftr:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>
          You didn’t take an action VA requested in order to continue your
          appeal. If this information is incorrect, or if you want to reopen
          your appeal, please contact your Veterans Service Organization or
          representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.ramp:
      contents.title =
        'You opted in to the Rapid Appeals Modernization Program (RAMP)';
      contents.description = (
        <p>
          You chose to participate in the new Supplemental Claim or Higher-Level
          Review options. This doesn’t mean that your appeal has been closed. If
          this information is incorrect, please contact your Veterans Service
          Organization or representative as soon as possible.
        </p>
      );
      break;
    case STATUS_TYPES.reconsideration:
      contents.title = 'Your Motion for Reconsideration was denied';
      contents.description = (
        <p>
          The Board of Veterans’ Appeals declined to reopen your appeal. Please
          contact your Veterans Service Organization or representative for more
          information.
        </p>
      );
      break;
    case STATUS_TYPES.death: {
      const { first, middle, last } = name;
      const nameString = `${first || ''} ${middle || ''} ${last || ''}`;
      contents.title = 'The appeal was closed';
      contents.description = (
        <p>
          VA records indicate that {_.startCase(_.toLower(nameString))} is
          deceased, so this appeal has been closed. If this information is
          incorrect, please contact your Veterans Service Organization or
          representative as soon as possible.
        </p>
      );
      break;
    }
    case STATUS_TYPES.otherClose:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>
          Your appeal was dismissed or closed. Please contact your Veterans
          Service Organization or representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.merged:
      contents.title = 'Your appeal was merged';
      contents.description = (
        <div>
          <p>
            Your appeal was merged with another appeal. The Board of Veterans’
            Appeals merges appeals so that you can receive a single decision on
            as many appealed issues as possible. This appeal was merged with an
            older appeal that was closest to receiving a Board decision.
          </p>
          <p>
            Check <Link to="/your-claims">Your claims and appeals</Link> for the
            appeal that contains the issues merged from this appeal.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.statutoryOptIn:
      contents.title =
        'You requested a decision review under the Appeals Modernization Act';
      contents.description = (
        <div>
          <p>
            A new law, the Veterans Appeals Improvement and Modernization Act,
            took effect on February 19, 2019. Although your appeal started
            before the new law took effect, you asked for it to be converted
            into one of the new decision review options.
          </p>
          <p>
            Check <Link to="/your-claims">Your claims and appeals</Link> for the
            decision review that contains the issues from this appeal, or learn
            more about{' '}
            <a href={DECISION_REVIEW_URL}>
              decision reviews under the Appeals Modernization Act
            </a>
            .
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.evidentiaryPeriod:
      contents.title = 'Your appeals file is open for new evidence';
      contents.description = (
        <div>
          <p>
            Because you requested the {getDocketName(amaDocket)} appeal option,
            the Board of Veterans’ Appeals will hold your case open for new
            evidence for 90 days. You can send new evidence to the Board at:
          </p>
          <p className="va-address-block">
            Board of Veterans’ Appeals
            <br />
            PO Box 27063
            <br />
            Washington, DC 20038
            <br />
            Fax 844-678-8979
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.postBvaDtaDecision: {
      const formattedBvaDecisionDate = format(
        addDays(new Date(details.bvaDecisionDate), 1),
        'MMMM d, yyyy',
      );
      const formattedAojDecisionDate = format(
        addDays(new Date(details.aojDecisionDate), 1),
        'MMMM d, yyyy',
      );
      contents.title = `The ${aojDescription} corrected an error`;
      contents.description = (
        <div>
          <p>
            In the {formattedBvaDecisionDate} decision, a judge at the Board of
            Veterans’ Appeals identified an error that needed to be corrected. A
            reviewer at the {aojDescription} completed the judge’s instructions
            and sent you a new decision on {formattedAojDecisionDate}. Here's an
            overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
          <p>
            If you disagree with either the Board decision or the{' '}
            {aojDescription} decision, you can request another review. The
            review options available to you depend on which decision you
            disagree with.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.bvaDecisionEffectuation: {
      const formattedBvaDecisionDate = format(
        addDays(new Date(details.bvaDecisionDate), 1),
        'MMMM d, yyyy',
      );
      const formattedAojDecisionDate = format(
        addDays(new Date(details.aojDecisionDate), 1),
        'MMMM d, yyyy',
      );
      contents.title = `The ${aojDescription} corrected an error`;
      contents.description = (
        <div>
          <p>
            On {formattedBvaDecisionDate}, a judge at the Board of Veterans’
            Appeals made a decision that changes your disability rating or
            eligibility for benefits. On {formattedAojDecisionDate}, the{' '}
            {aojDescription} sent you a new decision that updates your benefits.
          </p>
          <p>
            If you disagree with either the Board decision or the{' '}
            {aojDescription} decision, you can request another review. The
            review options available to you depend on which decision you
            disagree with.
          </p>
        </div>
      );
      break;
    }
    // TODO: Remove this if Caseflow fixes the issue on their end
    case 'sc_recieved':
    case STATUS_TYPES.scReceived:
      contents.title = 'A reviewer is examining your new evidence';
      contents.description = (
        <div>
          <p>
            A Supplemental Claim allows you to add new and relevant evidence to
            your case. When you filed a Supplemental Claim, you included new
            evidence or identified evidence that the {aojDescription} should
            obtain.
          </p>
          {programArea !== 'compensation' && (
            <p>
              If you have more evidence to submit, you should do so as soon as
              possible.
            </p>
          )}
          {programArea === 'compensation' && (
            <div>
              <p>
                If you have more evidence to submit, you should do so as soon as
                possible. You can send new evidence to the {aojDescription} at:
              </p>
              <p className="va-address-block">
                Department of Veterans Affairs
                <br />
                Evidence Intake Center
                <br />
                PO Box 4444
                <br />
                Janesville, WI 53547-4444
              </p>
            </div>
          )}
          <p>
            A reviewer will look at this new evidence, as well as evidence VA
            already had, and determine whether it changes the decision. If
            needed, they may contact you to ask for more evidence or to schedule
            a new medical exam.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.hlrReceived:
      contents.title =
        'A higher-level reviewer is taking a new look at your case';
      contents.description = (
        <div>
          <p>
            By requesting a Higher-Level Review, you asked for a higher-level at
            the {aojDescription} to look at your case and determine whether they
            can change the decision based on a difference of opinion or because
            VA made an error.
          </p>
          {details.informalConference && (
            <p>
              You requested an informal conference. The reviewer will contact
              you at the phone number you provided to schedule a time to speak
              to you and/or your representative. When you speak to the reviewer,
              you can say why you think the decision should be changed and
              identify errors.
            </p>
          )}
          <p>
            <strong>Note:</strong> Please don’t submit additional evidence. The
            reviewer will only consider evidence that VA already has.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.scDecision:
      contents.title = `The ${aojDescription} made a decision`;
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a decision on your Supplemental Claim.
            Here’s an overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
        </div>
      );
      break;
    case STATUS_TYPES.hlrDecision:
      contents.title = `The ${aojDescription} made a decision`;
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a decision on your Higher-Level
            Review. Here’s an overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
        </div>
      );
      break;
    case STATUS_TYPES.hlrDtaError:
      contents.title = `The ${aojDescription} is correcting an error`;
      contents.description = (
        <p>
          During their review, the higher-level reviewer identified an error
          that must be corrected before deciding your case. If needed, VA may
          contact you to ask for more evidence or to schedule a new medical
          exam.
        </p>
      );
      break;
    case STATUS_TYPES.scClosed:
      contents.title = 'Your Supplemental Claim was closed';
      contents.description = (
        <p>
          Your Supplemental Claim was closed. Please contact VA or your Veterans
          Service Organization or representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.hlrClosed:
      contents.title = 'Your Higher-Level Review was closed';
      contents.description = (
        <p>
          Your Higher-Level Review was closed. Please contact VA or your
          Veterans Service Organization or representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.remandReturn:
      contents.title =
        'Your appeal was returned to the Board of Veterans’ Appeals';
      contents.description = (
        <p>
          The Veterans Benefits Administration finished their work on the remand
          and will return your case to the Board of Veterans’ Appeals.
        </p>
      );
      break;
    default:
      contents.title = 'We don’t know your status';
      contents.description = (
        <p>We’re sorry, VA.gov will soon be updated to show your status.</p>
      );

      Sentry.withScope(scope => {
        scope.setExtra('statusType', statusType);
        Sentry.captureMessage('appeals-unknown-status-type');
      });
  }

  return contents;
}
