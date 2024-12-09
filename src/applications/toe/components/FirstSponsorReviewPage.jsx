import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAppData } from '../selectors';

const FirstSponsorReviewPage = ({ data, editPage, title }) => {
  // Find the selected sponsor from the list of sponsors
  const sponsorIndex = data.sponsors.sponsors.findIndex(
    sponsor => sponsor.id === data.firstSponsor,
  );

  let firstSponsorName = '';
  if (sponsorIndex > -1) {
    firstSponsorName = `Sponsor ${sponsorIndex + 1}: ${
      data.sponsors.sponsors[sponsorIndex].name
    }`;
  }

  return (
    <div className="form-review-panel-page">
      {/* Title and Edit Button on the Same Line */}
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        {/* Use the new button style */}
        <va-button
          uswds
          aria-label={`Edit ${title}`}
          secondary
          text="Edit"
          onClick={editPage}
        />
      </div>

      <dl className="review">
        <div className="review-row">
          <dt>Which sponsor’s benefits would you like to use first?</dt>
          <dd>{firstSponsorName}</dd>
        </div>
      </dl>
    </div>
  );
};

FirstSponsorReviewPage.propTypes = {
  data: PropTypes.shape({
    firstSponsor: PropTypes.string.isRequired,
    sponsors: PropTypes.shape({
      sponsors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  firstSponsor: state.form?.data?.firstSponsor,
  sponsors: state.form?.data?.sponsors,
  ...getAppData(state),
});

export default connect(mapStateToProps)(FirstSponsorReviewPage);
