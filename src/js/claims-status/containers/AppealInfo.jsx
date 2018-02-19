import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';

import Breadcrumbs from '../components/Breadcrumbs';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { systemDownMessage } from '../../common/utils/error-messages';
import AppealNotFound from '../components/appeals-v2/AppealNotFound';
import { getAppealsV2 } from '../actions/index.jsx';
import AppealHeader from '../components/appeals-v2/AppealHeader';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';
import AppealHelpSidebar from '../components/appeals-v2/AppealHelpSidebar';

import {
  EVENT_TYPES,
  isolateAppeal,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
  AVAILABLE,
} from '../utils/appeals-v2-helpers';

export class AppealInfo extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppealsV2();
    }
  }

  createHeading = () => {
    const firstClaim = this.props.appeal.attributes.events.find(a => a.type === EVENT_TYPES.claim);
    const appealDate = firstClaim ? moment(firstClaim.date, 'YYYY-MM-DD').format(' MMMM YYYY') : '';
    return `Appeal of Claim Decision${appealDate}`;
  }

  render() {
    const { params, appeal, appealsLoading, appealsAvailability, children } = this.props;
    let appealContent;

    // Availability is determined by whether or not the API returned an appeals array
    // for this user. However, it doesn't speak to whether the appeal that's been
    // requested is available in the array. This is why we have to check for both
    // AVAILABLE status as well as whether or not the appeal exists.
    if (appealsLoading) {
      appealContent = <LoadingIndicator message="Please wait while we load your appeal..."/>;
    } else if (appealsAvailability === AVAILABLE && appeal) {
      // Maybe could simplify this to just check if (appeal) instead
      const claimHeading = this.createHeading();
      appealContent = (
        <div>
          <div className="row">
            <Breadcrumbs>
              <li><Link to="your-claims">Your Claims and Appeals</Link></li>
              <li><strong>{claimHeading}</strong></li>
            </Breadcrumbs>
          </div>
          <div className="row">
            <AppealHeader
              heading={claimHeading}
              lastUpdated={appeal.attributes.updated}/>
          </div>
          <div className="row">
            <div className="medium-8 columns">
              <AppealsV2TabNav
                appealId={params.id}/>
              <div className="va-tab-content va-appeals-content">
                {React.Children.map(children, child => React.cloneElement(child, { appeal }))}
              </div>
            </div>
            <div className="medium-4 columns help-sidebar">
              {appeal && <AppealHelpSidebar location={appeal.attributes.location} aoj={appeal.attributes.aoj}/>}
            </div>
          </div>
        </div>
      );
    } else if (appealsAvailability === AVAILABLE && !appeal) {
      // Yes, we have your appeals. No, the one you requested isn't one of them.
      appealContent = <AppealNotFound/>;
    } else if (appealsAvailability === USER_FORBIDDEN_ERROR) {
      appealContent = <h1>We couldn’t find your records</h1>;
    } else if (appealsAvailability === RECORD_NOT_FOUND_ERROR) {
      appealContent = <h1>We couldn’t find your records</h1>;
    } else if (appealsAvailability === VALIDATION_ERROR) {
      appealContent = systemDownMessage;
    } else if (appealsAvailability === BACKEND_SERVICE_ERROR) {
      appealContent = systemDownMessage;
    } else if (appealsAvailability === FETCH_APPEALS_ERROR) {
      appealContent = systemDownMessage;
    } else {
      appealContent = systemDownMessage;
    }

    return (appealContent);
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
  })
};

function mapStateToProps(state, ownProps) {
  const { appealsLoading, appealsAvailability } = state.disability.status.claimsV2;
  return {
    appeal: isolateAppeal(state, ownProps.params.id),
    appealsLoading,
    appealsAvailability,
  };
}

const mapDispatchToProps = { getAppealsV2 };

export default connect(mapStateToProps, mapDispatchToProps)(AppealInfo);
