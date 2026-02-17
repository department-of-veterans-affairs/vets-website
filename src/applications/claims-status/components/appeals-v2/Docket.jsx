import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { flow, sortBy, toPairs } from 'lodash';
import omit from 'platform/utilities/data/omit';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import DocketCard from './DocketCard';
import {
  APPEAL_ACTIONS,
  DOCKET_TYPES,
  getDocketName,
} from '../../utils/appeals-v2-helpers';

/**
 * @param {Number} ahead - The number of appeals ahead of this one
 * @param {Number} total - The total number of appeals in the docket line
 * @param {Number} totalAllDockets - The total number of appeals on any docket at the Board
 * @param {String} month - The date the form 9 was sent in
 * @param {String} docketMonth- The month that the board is looking at (or older)
 * @param {String} appealAction - The type of appeal
 * @param {Bool}   aod - Whether the appeal is Advanced on the Docket
 * @param {Bool}   front - Whether the appeal is at the front of the docket
 * @param {Object} eta - Estimated decision dates for each docket
 * @param {String} type - The docket of the appeal
 * @param {Bool}   eligibleToSwitch - Whether the appellant can switch the docket of their appeal
 * @param {String} switchDueDate - The deadline for switching the docket of an appeal
 */
function Docket({
  ahead,
  total,
  totalAllDockets,
  month,
  docketMonth,
  appealAction,
  aod,
  front: frontOfDocket,
  eta,
  type: amaDocket,
  eligibleToSwitch,
  switchDueDate,
}) {
  // TODO: Assess how accessible this is

  const isLegacy = !amaDocket;

  const monthFormatted = moment(month, 'YYYY-MM-DD').format('MMMM YYYY');

  const docketMonthFormatted = moment(docketMonth, 'YYYY-MM-DD').format(
    'MMMM YYYY',
  );

  const otherEtas = flow(
    e => omit(amaDocket, e),
    toPairs,
    e => sortBy(e, a => a[1]),
  )(eta || {});

  const switchDueDateFormatted = moment(switchDueDate, 'YYYY-MM-DD').format(
    'MMMM D, YYYY',
  );

  let content;
  if (aod) {
    // AoD (Advanced on the Docket) should over-ride post-CAVC remand and default content
    content = (
      <div>
        <p>
          Your appeal is Advanced on the Docket. This could be because you are
          older than 75, because you are suffering a serious illness or are in
          financial distress, or for other sufficient cause.
        </p>
        <p>
          Advanced on the Docket appeals are prioritized so that they’re always
          at the front of the line. Your appeal will be sent to a judge as soon
          as it’s ready for their review.
        </p>
      </div>
    );
  } else if (appealAction === APPEAL_ACTIONS.postCavcRemand) {
    // Post-CAVC remand should over-ride default content but not AoD
    content = (
      <p>
        Your appeal was remanded by the U.S. Court of Appeals for Veterans
        Claims. Court Remand appeals are prioritized so that they’re always at
        the front of the line. Your appeal will be sent to a judge as soon as
        it’s ready for their review.
      </p>
    );
  } else {
    let yourPlaceText;
    if (frontOfDocket) {
      yourPlaceText = (
        <p>
          The Board is currently reviewing appeals from {docketMonthFormatted}{' '}
          or older. Your appeal is eligible to be sent to a judge when it’s
          ready for their review.
        </p>
      );
    } else if (isLegacy) {
      yourPlaceText = (
        <p>
          There are {total.toLocaleString()} appeals on the docket, not
          including Advanced on the Docket and Court Remand appeals. Some of
          these appeals are not ready to be sent to a judge. A judge will begin
          work on your appeal when it’s among the oldest appeals that are ready
          for their review. The Board is currently reviewing appeals from{' '}
          {docketMonthFormatted} or older.
        </p>
      );
    } else if (totalAllDockets) {
      yourPlaceText = (
        <p>
          There are {total.toLocaleString()} appeals on the{' '}
          {getDocketName(amaDocket)} docket, not including Advanced on the
          Docket and Court Remand appeals. Some of these appeals are not ready
          to be sent to a judge. A judge will begin work on your appeal when
          it’s among the oldest appeals that are ready for their review. In
          total, there are {totalAllDockets.toLocaleString()} appeals waiting at
          the Board.
        </p>
      );
    } else {
      yourPlaceText = (
        <p>
          Check back next month for more information on where your appeal is in
          line and how long until a judge is ready for your appeal.
        </p>
      );
    }

    content = (
      <div>
        <p>
          The Board of Veterans’ Appeals reviews cases in the order they’re
          received. When you{' '}
          {isLegacy
            ? 'completed a VA Form 9'
            : `requested a ${getDocketName(amaDocket)} appeal`}{' '}
          in {monthFormatted}, your appeal was added to the{' '}
          {isLegacy ? 'Board’s' : getDocketName(amaDocket)} docket, securing
          your spot in line.
        </p>
        {yourPlaceText}
        {ahead && <DocketCard total={total} ahead={ahead} docket={amaDocket} />}
        <h2>Is there a way to prioritize my appeal?</h2>
        <p>
          If you are suffering a serious illness or are in financial distress,
          or for another sufficient cause, you can apply to have your appeal{' '}
          <strong>Advanced on the Docket</strong>. If you’re older than 75, your
          appeal will receive this status automatically. Advanced on the Docket
          appeals are prioritized so that they’re always at the front of the
          line.
        </p>
        <p>
          <VaLink
            target="_blank"
            href="/disability/file-an-appeal/request-priority-review/"
            text="Learn more about requesting Advanced on the Docket status."
          />
        </p>
      </div>
    );
  }

  // TODO: Link the form names once the forms are available

  return (
    <div>
      <h2>How long until a judge is ready for your appeal?</h2>
      {content}
      {eligibleToSwitch && (
        <div>
          {amaDocket === DOCKET_TYPES.directReview && (
            <div>
              <h2>Can I add new evidence or request a hearing?</h2>
              <p>
                You requested a Direct Review, which is the fastest appeal
                option but means that you can’t submit new evidence or have a
                hearing with a judge.
              </p>
              <p>
                You can switch to a different appeal option, but this will
                increase the time that it takes to get a decision. You have
                until {switchDueDateFormatted} to submit a new VA Form 10182
                (Board Appeal) with a different appeal option selected.
              </p>
            </div>
          )}
          {amaDocket === DOCKET_TYPES.evidenceSubmission && (
            <div>
              <h2>
                What if I want a hearing or no longer want to add new evidence?
              </h2>
              <p>
                Provided you haven’t already added new evidence, you can switch
                to a different appeal option. You have until{' '}
                {switchDueDateFormatted} to submit a new{' '}
                <VaLink
                  href="/decision-reviews/forms/board-appeal-10182.pdf"
                  text="VA Form 10182 (Board Appeal)"
                />{' '}
                with a different appeal option selected.
              </p>
            </div>
          )}
          {amaDocket === DOCKET_TYPES.hearingRequest && (
            <div>
              <h2>What if I no longer want to request a hearing?</h2>
              <p>
                Provided you haven’t already had a hearing, you can switch to a
                different appeal option. You have until {switchDueDateFormatted}{' '}
                to submit a new{' '}
                <VaLink
                  href="/decision-reviews/forms/board-appeal-10182.pdf"
                  text="VA Form 10182 (Board Appeal)"
                />{' '}
                with a different appeal option selected.
              </p>
            </div>
          )}
          {!aod && (
            <div>
              <h3>
                If I switch to a different appeal option, will I lose my place
                in line?
              </h3>
              <p>
                If you switch to a different appeal option, you will keep the
                same docket date, and your appeal will be decided at the same
                time as other appeals from {monthFormatted}. However, the time
                that it takes to get a decision is different on each docket.
              </p>
              <ul>
                {otherEtas.map(a => (
                  <li key={a[0]}>
                    <strong>
                      {moment(a[1], 'YYYY-MM-DD').format('MMMM YYYY')}
                    </strong>{' '}
                    &mdash; {getDocketName(a[0])} estimate
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Docket.propTypes = {
  ahead: PropTypes.number,
  total: PropTypes.number,
  totalAllDockets: PropTypes.number,
  month: PropTypes.string.isRequired,
  docketMonth: PropTypes.string,
  appealAction: PropTypes.string,
  aod: PropTypes.bool,
  front: PropTypes.bool,
  eta: PropTypes.object,
  type: PropTypes.string,
  eligibleToSwitch: PropTypes.bool,
  switchDueDate: PropTypes.string,
};

export default Docket;
