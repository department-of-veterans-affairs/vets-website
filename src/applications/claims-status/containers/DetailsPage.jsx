import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import ClaimDetailLayout from '../components/ClaimDetailLayout';
import { getClaimType } from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

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
      setFocus('.va-tab-trigger--current');
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
    document.title = this.props.loading
      ? 'Details - Your Claim'
      : `Details - Your ${getClaimType(this.props.claim)} Claim`;
  }

  render() {
    const { claim, loading, synced } = this.props;

    let content = null;
    if (!loading) {
      const {
        claimDate,
        claimType,
        contentionList,
        dateFiled,
        vaRepresentative,
      } = claim.attributes;

      const openDate = dateFiled || claimDate;

      content = (
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
              {contentionList && contentionList.length ? (
                <ul className="claim-detail-list">
                  {contentionList.map((contention, index) => (
                    <li key={index} className="claim-detail-list-item">
                      {contention}
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
            <dd>{moment(openDate).format('MMM D, YYYY')}</dd>
            <dt className="claim-detail-label">
              <h4>Your representative for VA claims</h4>
            </dt>
            <dd>{vaRepresentative || 'Not Available'}</dd>
          </dl>
        </>
      );
    }

    return (
      <ClaimDetailLayout
        claim={claim}
        currentTab="Details"
        loading={loading}
        synced={synced}
      >
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
    synced: claimsState.claimSync.synced,
  };
}

DetailsPage.propTypes = {
  claim: PropTypes.object,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  synced: PropTypes.bool,
};

export default connect(mapStateToProps)(DetailsPage);

export { DetailsPage };
