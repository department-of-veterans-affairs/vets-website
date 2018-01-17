import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';

import Breadcrumbs from '../components/Breadcrumbs';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import AppealNotFound from '../components/appeals-v2/AppealNotFound';
import { getAppealsV2 } from '../actions/index.jsx';
import AppealHeader from '../components/appeals-v2/AppealHeader';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';
import AppealHelpSidebar from '../components/appeals-v2/AppealHelpSidebar';

import { EVENT_TYPES, isolateAppeal } from '../utils/appeals-v2-helpers';

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
    const { params, appeal, appealsLoading, children } = this.props;
    let appealContent;
    if (appeal) {
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
    } else if (appealsLoading) {
      appealContent = <LoadingIndicator message="Please wait while we load your appeal..."/>;
    } else {
      // Appeals finished loading but appeal not found, so the ID passed in the params
      // doesn't match any appeals in Redux appeals array (at least not for this user)
      // TO-DO: Get input from content team
      appealContent = <AppealNotFound/>;
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
  const { appealsLoading } = state.disability.status.appeals;
  // appealsLoading is not initialized in Redux, it's added once fetch starts. We
  // need it to be available immediately to know whether to show the loading spinner
  const computedLoading = (typeof appealsLoading === 'undefined')
    ? true
    : appealsLoading;
  return {
    appeal: isolateAppeal(state, ownProps.params.id),
    appealsLoading: computedLoading,
  };
}

const mapDispatchToProps = { getAppealsV2 };

export default connect(mapStateToProps, mapDispatchToProps)(AppealInfo);
