import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import moment from 'moment';

import { scrollToTop } from 'platform/utilities/scroll';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';

import { getAppealsV2 as getAppealsV2Action } from '../actions';
import AppealNotFound from '../components/appeals-v2/AppealNotFound';
import AppealHeader from '../components/appeals-v2/AppealHeader';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';
import AppealHelpSidebar from '../components/appeals-v2/AppealHelpSidebar';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import CopyOfExam from '../components/CopyOfExam';
import ServiceUnavailableAlert from '../components/ServiceUnavailableAlert';
import { setUpPage } from '../utils/page';
import withRouter from '../utils/withRouter';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  isolateAppeal,
  getTypeName,
} from '../utils/appeals-v2-helpers';

import { RECORD_NOT_FOUND_ERROR } from '../actions/types';

const AVAILABLE = 'AVAILABLE';

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

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
    const { appeal, appealsLoading, getAppealsV2 } = this.props;
    if (!appeal) {
      getAppealsV2();
    }
    if (!appealsLoading) {
      setUpPage();
    } else {
      scrollToTop({ behavior: 'instant' });
    }
  }

  createHeading = () => {
    let requestEventType;
    const { appeal } = this.props;
    switch (appeal.type) {
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
    const requestEvent = appeal.attributes.events.find(
      event => event.type === requestEventType,
    );

    let appealTitle = capitalizeWord(getTypeName(appeal));

    if (requestEvent) {
      appealTitle += ` received ${moment(requestEvent.date).format(
        'MMMM YYYY',
      )}`;
    }

    return appealTitle;
  };

  render() {
    const {
      appeal,
      fullName,
      appealsLoading,
      appealsAvailability,
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
          <va-loading-indicator message="Please wait while we load your appeal..." />
        </div>
      );
    } else if (appealsAvailability === AVAILABLE && appeal) {
      // Maybe could simplify this to just check if (appeal) instead
      claimHeading = this.createHeading();
      appealContent = (
        <>
          <AppealsV2TabNav />
          <div className="tab-content va-appeals-content">
            <Outlet context={[appeal, fullName]} />
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
      appealContent = (
        <>
          <h1>We encountered a problem</h1>
          <ServiceUnavailableAlert
            headerLevel={2}
            services={['appeals']}
            useSingular
          />
        </>
      );
    }

    const crumb = {
      href: `../status`,
      label: 'Status details',
      isRouterLink: true,
    };

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 column">
            <ClaimsBreadcrumbs crumbs={[crumb]} />
          </div>
        </div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 column">
            {!!(claimHeading && appeal) && (
              <AppealHeader
                heading={claimHeading}
                lastUpdated={appeal.attributes.updated}
              />
            )}
            {appealContent}
            {appeal && (
              <AppealHelpSidebar
                location={appeal.attributes.location}
                aoj={appeal.attributes.aoj}
              />
            )}
            <CopyOfExam />
          </div>
        </div>
      </div>
    );
  }
}

AppealInfo.propTypes = {
  appealsLoading: PropTypes.bool.isRequired,
  getAppealsV2: PropTypes.func.isRequired,
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  appeal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
  }),
  appealsAvailability: PropTypes.string,
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
  return {
    appeal: isolateAppeal(state, ownProps.params.id),
    appealsLoading,
    appealsAvailability,
    fullName: state.user.profile.userFullName,
  };
}

const mapDispatchToProps = { getAppealsV2: getAppealsV2Action };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AppealInfo),
);
