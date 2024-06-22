import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAppData } from '../selectors';

function SelectedSponsorsReviewPage({ data, editPage, title }) {
  const selectedSponsors = data?.sponsors?.sponsors?.flatMap(
    (sponsor, index) =>
      sponsor.selected ? [`Sponsor ${index + 1}: ${sponsor.name}`] : [],
  );

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <va-button
          aria-label={`Edit ${title}`}
          className="edit-btn primary-outline"
          onClick={editPage}
          type="button"
        >
          Edit
        </va-button>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Which sponsor's benefit would you like to use?</dt>
          <dd>
            <ul className="toe-review-page_selected-sponsors vads-u-margin--0 vads-u-padding--0">
              {selectedSponsors.map((sponsor, index) => (
                <li className="vads-u-margin--0" key={`sponsor-${index}`}>
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
};

const mapStateToProps = state => ({
  ...getAppData(state),
});
export default connect(mapStateToProps)(SelectedSponsorsReviewPage);
