import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import ClaimDetailLayout from '../components/ClaimDetailLayout';
import {
  buildDateFormatter,
  getClaimType,
  setDocumentTitle,
  claimAvailable,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// HELPERS
const formatDate = buildDateFormatter();

class DetailsPage extends React.Component {
  componentDidMount() {
    this.setTitle();
    if (!isTab(this.props.lastPage)) {
      if (!this.props.loading) {
        setUpPage();
      } else {
        scrollToTop();
      }
    } else {
      setFocus('#tabPanelDetails');
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.loading &&
      prevProps.loading &&
      !isTab(this.props.lastPage)
    ) {
      setUpPage(false);
    }
    if (this.props.loading !== prevProps.loading) {
      this.setTitle();
    }
  }

  setTitle() {
    const { claim } = this.props;

    if (claimAvailable(claim)) {
      const claimDate = formatDate(claim.attributes.claimDate);
      const claimType = getClaimType(claim);
      const title = `Details Of ${claimDate} ${claimType} Claim`;

      setDocumentTitle(title);
    } else {
      setDocumentTitle('Details Of Your Claim');
    }
  }

  getPageContent() {
    const { claim } = this.props;

    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const { claimDate, claimType, contentions } = claim.attributes;
    const hasContentions = contentions && contentions.length;

    return (
      <>
        <h3 className="vads-u-visibility--screen-reader">Claim details</h3>
        <dl className="claim-details">
          <dt className="claim-detail-label">
            <h4>Claim type</h4>
          </dt>
          <dd>{claimType || 'Not Available'}</dd>
          <dt className="claim-detail-label">
            <h4>What you’ve claimed</h4>
          </dt>
          <dd>
            {hasContentions ? (
              <ul className="claim-detail-list">
                {contentions.map((contention, index) => (
                  <li
                    key={index}
                    className="claim-detail-list-item"
                    data-dd-privacy="mask"
                  >
                    {contention.name}
                  </li>
                ))}
              </ul>
            ) : (
              'Not Available'
            )}
          </dd>
          <dt className="claim-detail-label">
            <h4>Date received</h4>
          </dt>
          <dd>{formatDate(claimDate)}</dd>
        </dl>
      </>
    );
  }

  render() {
    const { claim, loading } = this.props;

    let content = null;
    if (!loading) {
      content = this.getPageContent();
    }

    return (
      <ClaimDetailLayout claim={claim} currentTab="Details" loading={loading}>
        {content}
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    lastPage: claimsState.routing.lastPage,
  };
}

DetailsPage.propTypes = {
  claim: PropTypes.object,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(DetailsPage);

export { DetailsPage };
