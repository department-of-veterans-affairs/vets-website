import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAppData } from '../selectors';
import {
  IM_NOT_SURE_LABEL,
  IM_NOT_SURE_VALUE,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function FirstSponsorReviewPage({
  data,
  editPage,
  title,
  showMebEnhancements08,
}) {
  let firstSponsorName;
  if (
    !showMebEnhancements08 &&
    data.firstSponsor === SPONSOR_NOT_LISTED_VALUE
  ) {
    firstSponsorName = [
      'Sponsor that I’ve added:',
      data.sponsorFullName.first,
      data.sponsorFullName.middle,
      data.sponsorFullName.last,
      data.sponsorFullName.suffix,
    ].join(' ');
  } else if (data.firstSponsor === IM_NOT_SURE_VALUE) {
    firstSponsorName = IM_NOT_SURE_LABEL;
  } else {
    const sponsorIndex = data.sponsors.sponsors.findIndex(
      sponsor => sponsor.id === data.firstSponsor,
    );
    if (sponsorIndex > -1) {
      firstSponsorName = `Sponsor ${sponsorIndex + 1}: ${
        data.sponsors.sponsors[sponsorIndex].name
      }`;
    }
  }

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <button
          aria-label={`Edit ${title}`}
          className="edit-btn primary-outline"
          onClick={editPage}
          type="button"
        >
          Edit
        </button>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Which sponsor’s benefits would you like to use first?</dt>
          <dd>{firstSponsorName}</dd>
        </div>
      </dl>
    </div>
  );
}

FirstSponsorReviewPage.propTypes = {
  data: PropTypes.shape({
    firstSponsor: PropTypes.string,
    sponsorFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
    sponsors: PropTypes.shape({
      sponsors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        }),
      ),
    }),
  }),
  editPage: PropTypes.func,
  showMebEnhancements08: PropTypes.bool,
  title: PropTypes.string,
};

const mapStateToProps = state => ({
  firstSponsor: state.form?.data?.firstSponsor,
  sponsors: state.form?.data?.sponsors,
  ...getAppData(state),
  showMebEnhancements08: state.form?.data?.showMebEnhancements08,
});

export default connect(mapStateToProps)(FirstSponsorReviewPage);
