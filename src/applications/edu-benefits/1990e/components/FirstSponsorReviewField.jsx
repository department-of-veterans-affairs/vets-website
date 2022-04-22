import React from 'react';
import { connect } from 'react-redux';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function FirstSponsorReviewField({ sponsors, uiSchema }) {
  if (!uiSchema) {
    return <></>;
  }

  let firstSponsor;
  if (sponsors.firstSponsor === SPONSOR_NOT_LISTED_VALUE) {
    firstSponsor = SPONSOR_NOT_LISTED_LABEL;
  } else {
    const sponsorIndex = sponsors.sponsors.findIndex(
      sponsor => sponsor.id === sponsors.firstSponsor,
    );
    firstSponsor = `Sponsor ${sponsorIndex + 1}: ${
      sponsors.sponsors[sponsorIndex].name
    }`;
  }

  return <>{firstSponsor}</>;
}

const mapStateToProps = state => ({
  sponsors: state.form.data.sponsors,
});

export default connect(mapStateToProps)(FirstSponsorReviewField);
