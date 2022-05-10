import React from 'react';
import { connect } from 'react-redux';
import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function FirstSponsorReviewField({ firstSponsor, sponsors, uiSchema }) {
  if (!uiSchema) {
    return <></>;
  }

  let firstSponsorName;
  if (firstSponsor === SPONSOR_NOT_LISTED_VALUE) {
    firstSponsorName = SPONSOR_NOT_LISTED_LABEL;
  } else if (firstSponsor === IM_NOT_SURE_VALUE) {
    firstSponsorName = IM_NOT_SURE_LABEL;
  } else {
    const sponsorIndex = sponsors.sponsors.findIndex(
      sponsor => sponsor.id === firstSponsor,
    );
    if (sponsorIndex > -1) {
      firstSponsorName = `Sponsor ${sponsorIndex + 1}: ${
        sponsors.sponsors[sponsorIndex].name
      }`;
    }
  }

  return firstSponsorName ? <>{firstSponsorName}</> : <></>;
}

const mapStateToProps = state => ({
  firstSponsor: state.form?.data?.firstSponsor,
  sponsors: state.form.data.sponsors,
});

export default connect(mapStateToProps)(FirstSponsorReviewField);
