import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';

import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AppealNotFound from '../components/appeals-v2/AppealNotFound';
import { getAppealsV2 } from '../actions/index.jsx';
import AppealHeader from '../components/appeals-v2/AppealHeader';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';
import AppealHelpSidebar from '../components/appeals-v2/AppealHelpSidebar';
import { setUpPage, scrollToTop } from '../utils/page';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  isolateAppeal,
  RECORD_NOT_FOUND_ERROR,
  AVAILABLE,
  getTypeName,
} from '../utils/appeals-v2-helpers';
import CallVBACenter from 'platform/static-data/CallVBACenter';

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

const appealsDownMessage = (
  <div className="row" id="appealsDownMessage">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>We’re sorry. Something went wrong on our end.</h3>
        <p>
          Please refresh this page or try again later. If it still doesn’t work,
          you can <CallVBACenter />
        </p>
      </div>
    </div>
  </div>
);

const recordsNotFoundMessage = (
  <div className="row" id="recordsNotFoundMessage">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>We’re sorry. We can’t find your records in our system.</h3>
        <p>
          If you think they should be here, please try again later or{' '}
          <CallVBACenter />
        </p>
      </div>
    </div>
  </div>
);

export class AppealInfo extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppealsV2();
    }
    if (!this.props.appealsLoading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }

  createHeading = () => {
    let requestEventType;
    switch (this.props.appeal.type) {
      case APPEAL_TYPES.legacy:
        requestEventType = EVENT_TYPES.nod;
        break;
      case APPEAL_TYPES.supplementalClaim:
        requestEventType = EVENT_TYPES.scRequest;
        break;
      case APPEAL_TYPES.higherLevelReview:
        requestEventType = EVENT_TYPES.hlrRequest;
        break;
      case APPEAL_TYPES.appeal:
        requestEventType = EVENT_TYPES.amaNod;
        break;
      default:
      // do nothing
    }
    const requestEvent = this.props.appeal.attributes.events.find(
      event => event.type === requestEventType,
    );

    let appealTitle = capitalizeWord(getTypeName(this.props.appeal));

    if (requestEvent) {
      appealTitle += ` received ${moment(requestEvent.date).format(
        'MMMM YYYY',
      )}`;
    }

    return appealTitle;
  };

  render() {
    const {
      params,
      appeal,
      fullName,
      appealsLoading,
      appealsAvailability,
      children,
    } = this.props;
    let appealContent;
    let claimHeading;

    // Availability is determined by whether or not the API returned an appeals array
    // for this user. However, it doesn't speak to whether the appeal that's been
    // requested is available in the array. This is why we have to check for both
    // AVAILABLE status as well as whether or not the appeal exists.
    if (appealsLoading) {
      appealContent = (
        <div className="vads-u-margin-bottom--2p5">
          <LoadingIndicator message="Please wait while we load your appeal..." />
        </div>
      );
    } else if (appealsAvailability === AVAILABLE && appeal) {
      // Maybe could simplify this to just check if (appeal) instead
      claimHeading = this.createHeading();
      appealContent = (
        <>
          <AppealsV2TabNav appealId={params.id} />
          <div className="va-tab-content va-appeals-content">
            {React.Children.map(children, child =>
              React.cloneElement(child, { appeal, fullName }),
            )}
          </div>
        </>
      );
    } else if (appealsAvailability === AVAILABLE && !appeal) {
      // Yes, we have your appeals. No, the one you requested isn't one of them.
      appealContent = <AppealNotFound />;
    } else if (appealsAvailability === RECORD_NOT_FOUND_ERROR) {
      appealContent = recordsNotFoundMessage;
    } else {
      // This includes
      //  USER_FORBIDDEN_ERROR,
      //  VALIDATION_ERROR,
      //  BACKEND_SERVICE_ERROR,
      //  FETCH_APPEALS_ERROR
      appealContent = appealsDownMessage;
    }

    return (
      <div>
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link
                  to={`appeals/${this.props.params.id}`}
                  key="claims-appeal"
                >
                  Status details
                </Link>
              </ClaimsBreadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {!!(claimHeading && appeal) && (
                <AppealHeader
                  heading={claimHeading}
                  lastUpdated={appeal.attributes.updated}
                />
              )}
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              {appealContent}
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
              {appeal && (
                <AppealHelpSidebar
                  location={appeal.attributes.location}
                  aoj={appeal.attributes.aoj}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AppealInfo.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  children: PropTypes.node.isRequired,
  appealsLoading: PropTypes.bool.isRequired,
  appeal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
  }),
  fullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};

function mapStateToProps(state, ownProps) {
  const {
    appealsLoading,
    v2Availability: appealsAvailability,
  } = state.disability.status.claimsV2;
  const { v1ToV2IdMap } = state.disability.status.appeals;
  return {
    appeal: isolateAppeal(state, ownProps.params.id, v1ToV2IdMap),
    appealsLoading,
    appealsAvailability,
    fullName: state.user.profile.userFullName,
  };
}

const mapDispatchToProps = { getAppealsV2 };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppealInfo);
