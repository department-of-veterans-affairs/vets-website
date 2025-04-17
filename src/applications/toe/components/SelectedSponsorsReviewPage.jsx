import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAppData } from '../selectors';

const SelectedSponsorsReviewPage = ({ data, editPage, title }) => {
  const selectedSponsors = data?.sponsors?.sponsors?.flatMap((sponsor, index) =>
    sponsor.selected ? [`Sponsor ${index + 1}: ${sponsor.name}`] : [],
  );

  return (
    <div className="form-review-panel-page">
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Title and Edit button on the same line */}
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
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
          <dt>Which sponsor’s benefit would you like to use?</dt>
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
};

SelectedSponsorsReviewPage.propTypes = {
  data: PropTypes.shape({
    sponsors: PropTypes.shape({
      someoneNotListed: PropTypes.bool,
      sponsors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          selected: PropTypes.bool.isRequired,
        }),
      ),
    }),
  }).isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  ...getAppData(state),
});

export default connect(mapStateToProps)(SelectedSponsorsReviewPage);
