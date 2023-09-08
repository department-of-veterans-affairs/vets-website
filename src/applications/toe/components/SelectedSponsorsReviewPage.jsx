import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SPONSOR_NOT_LISTED_LABEL } from '../constants';
import { getAppData } from '../selectors';

function SelectedSponsorsReviewPage({
  data,
  editPage,
  title,
  showMebEnhancements08,
}) {
  const selectedSponsors = data?.sponsors?.sponsors?.flatMap(
    (sponsor, index) =>
      sponsor.selected ? [`Sponsor ${index + 1}: ${sponsor.name}`] : [],
  );
  if (!showMebEnhancements08 && data?.sponsors?.someoneNotListed) {
    selectedSponsors.push(SPONSOR_NOT_LISTED_LABEL);
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
          <dt>Which sponsor's benefit would you like to use?</dt>
          <dd>
            <ul className="toe-review-page_selected-sponsors vads-u-margin--0 vads-u-padding--0">
              {selectedSponsors.map(sponsor => (
                <li className="vads-u-margin--0" key={sponsor}>
                  {sponsor}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
}

SelectedSponsorsReviewPage.propTypes = {
  data: PropTypes.shape({
    editPage: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    sponsors: PropTypes.shape({
      someoneNotListed: PropTypes.bool,
      sponsors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          selected: PropTypes.bool,
        }),
      ),
    }),
  }),
  showMebEnhancements08: PropTypes.bool,
};

const mapStateToProps = state => ({
  ...getAppData(state),
});
export default connect(mapStateToProps)(SelectedSponsorsReviewPage);
