import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DocketCard from './DocketCard';
import { APPEAL_TYPES } from '../../utils/appeals-v2-helpers';

/**
 * @param {Number} ahead - The number of appeals ahead of this one
 * @param {Number} total - The total number of appeals in the docket line
 * @param {String} form9Date - The date the form 9 was sent in (or something)
 * @param {String} docketMonth- The month that the board is looking at (or older)
 * @param {String} appealType - The type of appeal
 * @param {Bool}   aod - Whether the appeal is Advanced on Docket
 * @param {Bool}   frontOfDocket - Whether the appeal is at the front of the docket
 */
function Docket({ ahead, total, form9Date, docketMonth, appealType, aod, frontOfDocket }) {
  // TODO: Assess how accessible this is

  const date = moment(form9Date, 'YYYY-MM-DD').format('MMMM YYYY');

  // This is the only part that's different between the two "normal" contents
  let yourPlaceText;
  if (frontOfDocket) {
    yourPlaceText = <p>The Board is currently working on appeals from {docketMonth} or older. Your appeal is eligible to be assigned to a judge when it is ready for their review.</p>;
  } else {
    yourPlaceText = <p>There are {total} appeals on the docket, not including Advanced on Docket and Court Remand appeals. Some of these appeals are not ready to be assigned to a judge. A judge will begin work on your appeal when it is among the oldest appeals that are ready for their review. The Board is currently working on appeals from {docketMonth} or older.</p>;
  }

  // Start with the basic content...
  let content = (
    <React.fragment>
      <p>The Board of Veterans’ Appeals hears cases in the order they are received. When you completed a Form 9 in {date}, your appeal was added to the Board’s docket, securing your spot in line.</p>
      {yourPlaceText}
      <DocketCard total={total} ahead={ahead}/>
      <h2>Is there a way for my appeal to be decided more quickly?</h2>
      <p>If you are suffering a serious illness or are in financial distress, or for other sufficient cause, you can apply to have your appeal <strong>Advanced on Docket</strong>. If you are older than 75, your appeal will have this status automatically. Advanced on Docket appeals are prioritized so that they are always at the front of the line.</p>
      <p><a target="_blank" href="">Learn more about requesting Advanced on Docket status.</a></p>
    </React.fragment>
  );

  // ...and override it if necessary

  if (aod) {
    content = (
      <React.fragment>
        <p>Your appeal is Advanced on Docket. This could be because you or your representative requested this status, or because you are older than 75.</p>
        <p>Advanced on Docket appeals are prioritized so that they are always at the front of the line. Your appeal will be assigned to a judge as soon as it is ready for their review.</p>
      </React.fragment>
    );
  }

  // This should override the aod section
  if (appealType === APPEAL_TYPES.postCavcRemand) {
    content = <p>Your appeal was remanded by the Court of Appeals for Veterans’ Claims. Court Remand appeals are prioritized so that they are always at the front of the line. Your appeal will be assigned to a judge as soon as it is ready for their review.</p>;
  }

  return (
    <div>
      <h2>How long until a judge is ready to write your decision?</h2>
      {content}
    </div>
  );
}

Docket.propTypes = {
  ahead: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  form9Date: PropTypes.string.isRequired
};

export default Docket;

