import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import moment from 'moment';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';

import { getAppealsV2 as getAppealsV2Action } from '../actions';
import AppealNotFound from '../components/appeals-v2/AppealNotFound'; // eslint-disable-line import/no-named-as-default
import AppealHeader from '../components/appeals-v2/AppealHeader'; // eslint-disable-line import/no-named-as-default
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';
import AppealHelpSidebar from '../components/appeals-v2/AppealHelpSidebar'; // eslint-disable-line import/no-named-as-default
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import CopyOfExam from '../components/CopyOfExam';
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

const capitalizeWord = word =>
  word ? `${word[0].toUpperCase()}${word.slice(1)}` : '';

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

function AppealInfo({
  appeal,
  appealsLoading,
  appealsAvailability,
  fullName,
  getAppealsV2,
}) {
  // ------------------------------------------------------------- lifecycle --
  useEffect(() => {
    if (!appeal) {
      getAppealsV2();
    }
    if (!appealsLoading) {
      setUpPage();
    } else {
      scrollToTop();
    }
    // Intentionally empty dep-array mirrors single-run componentDidMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------- helpers --
  const createHeading = useCallback(
    () => {
      if (!appeal) return '';

      let requestEventType;
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
          requestEventType = null;
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
    },
    [appeal],
  );

  // -------------------------------------------------------------- content --
  let appealContent;
  let claimHeading;

  if (appealsLoading) {
    appealContent = (
      <div className="vads-u-margin-bottom--2p5">
        <va-loading-indicator message="Please wait while we load your appeal..." />
      </div>
    );
  } else if (appealsAvailability === AVAILABLE && appeal) {
    claimHeading = createHeading();
    appealContent = (
      <>
        <AppealsV2TabNav />
        <div className="tab-content va-appeals-content">
          <Outlet context={[appeal, fullName]} />
        </div>
      </>
    );
  } else if (appealsAvailability === AVAILABLE && !appeal) {
    appealContent = <AppealNotFound />;
  } else if (appealsAvailability === RECORD_NOT_FOUND_ERROR) {
    appealContent = recordsNotFoundMessage;
  } else {
    appealContent = appealsDownMessage;
  }

  const crumb = {
    href: '../status',
    label: 'Status details',
    isRouterLink: true,
  };

  // -------------------------------------------------------------- render --
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
