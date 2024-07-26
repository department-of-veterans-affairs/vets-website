import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import NeedHelp from '../components/NeedHelp';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import {
  // START ligthouse_migration
  submit5103 as submit5103Action,
  submitRequest as submitRequestAction,
  // END lighthouse_migration
  getClaim as getClaimAction,
} from '../actions';
import { setDocumentTitle, getClaimType } from '../utils/helpers';
import { setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';
import Default5103EvidenceNotice from '../components/claim-document-request-pages/Default5103EvidenceNotice';
import { standard5103Item } from '../constants';

const filesPath = '../files';
const statusPath = '../status';

class Standard5103NoticePage extends React.Component {
  componentDidMount() {
    setDocumentTitle('5103 Evidence Notice');
    if (!this.props.loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }

  render() {
    let content;

    if (this.props.loading) {
      content = (
        <va-loading-indicator
          set-focus
          message="Loading your claim information..."
        />
      );
    } else {
      content = <Default5103EvidenceNotice item={standard5103Item} />;
    }

    const { claim } = this.props;
    const claimType = getClaimType(claim).toLowerCase();

    const previousPageIsFilesTab = () => {
      const previousPage = sessionStorage.getItem('previousPage');
      return previousPage === 'files';
    };

    const filesBreadcrumb = {
      href: filesPath,
      label: `Files for your ${claimType} claim`,
      isRouterLink: true,
    };
    const statusBreadcrumb = {
      href: statusPath,
      label: `Status of your ${claimType} claim`,
      isRouterLink: true,
    };

    const previousPageBreadcrumb = previousPageIsFilesTab()
      ? filesBreadcrumb
      : statusBreadcrumb;

    const crumbs = [
      previousPageBreadcrumb,
      {
        href: '../5103-evidence-notice',
        label: '5103 Evidence Notice',
        isRouterLink: true,
      },
    ];

    return (
      <div>
        <div name="topScrollElement" />
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <ClaimsBreadcrumbs crumbs={crumbs} />
            <div>{content}</div>
            <NeedHelp />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const { claimDetail } = claimsState;

  return {
    claim: claimDetail.detail,
    loading: claimDetail.loading,
  };
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
  // START lighthouse_migration
  submit5103: submit5103Action,
  submitRequest: submitRequestAction,
  // END lighthouse_migration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Standard5103NoticePage),
);

Standard5103NoticePage.propTypes = {
  claim: PropTypes.object,
  getClaim: PropTypes.func,
  loading: PropTypes.bool,
  navigate: PropTypes.func,
  params: PropTypes.object,
};

export { Standard5103NoticePage };
