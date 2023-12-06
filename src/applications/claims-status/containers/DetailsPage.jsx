import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

// START lighthouse_migration
import ClaimDetailLayoutEVSS from '../components/evss/ClaimDetailLayout';
import DetailsPageContent from '../components/evss/DetailsPageContent';
import ClaimDetailLayoutLighthouse from '../components/ClaimDetailLayout';
import { DATE_FORMATS } from '../constants';
import { cstUseLighthouse } from '../selectors';
// END lighthouse_migration
import {
  buildDateFormatter,
  getClaimType,
  setDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// HELPERS
// START lighthouse_migration
const getClaimDate = claim => {
  const { claimDate, dateFiled } = claim.attributes;

  return claimDate || dateFiled || null;
};
// END lighthouse_migration

const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

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

    if (claim) {
      const claimDate = formatDate(getClaimDate(claim));
      const claimType = getClaimType(claim);
      const title = `Details Of ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Details Of Your Claim');
    }
  }

  getPageContent() {
    const { claim, useLighthouse } = this.props;
    if (!useLighthouse) {
      return <DetailsPageContent claim={claim} />;
    }

    const { claimDate, claimType, contentions } = claim.attributes || {};
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
                  <li key={index} className="claim-detail-list-item">
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
          <dd>{moment(claimDate).format('MMM D, YYYY')}</dd>
        </dl>
      </>
    );
  }

  render() {
    const { claim, loading, synced, useLighthouse } = this.props;

    let content = null;
    if (!loading) {
      content = this.getPageContent();
    }

    // START lighthouse_migration
    const ClaimDetailLayout = useLighthouse
      ? ClaimDetailLayoutLighthouse
      : ClaimDetailLayoutEVSS;
    // END lighthouse_migration

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
    useLighthouse: cstUseLighthouse(state, 'show'),
  };
}

DetailsPage.propTypes = {
  claim: PropTypes.object,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  synced: PropTypes.bool,
  useLighthouse: PropTypes.bool,
};

export default connect(mapStateToProps)(DetailsPage);

export { DetailsPage };
