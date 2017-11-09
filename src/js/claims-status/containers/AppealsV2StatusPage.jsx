import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAppealsV2 } from '../actions/index.jsx';

import History from '../components/appeals-v2/History';
import CurrentStatus from '../components/appeals-v2/CurrentStatus';
import Alerts from '../components/appeals-v2/Alerts';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page and is the source of truth
 * for the redux state. All child components shouldn't need to be connected to the store.
 */
class AppealsV2StatusPage extends React.Component {
  componentDidMount() {
    // Make sure we grab the appeals if we don't have them already
    // Useful if the user goes directly to the appeal status without going to the list first
    if (!this.props.appeal) {
      this.props.getAppealsV2();
    }
  }

  render() {
    return (
      <div>
        <History/>
        <CurrentStatus/>
        <Alerts/>
        <WhatsNext/>
        <Docket/>
      </div>
    );
  }
}

AppealsV2StatusPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const { appeals, loading } = claimsState.claims;
  const appeal = appeals.find(a => a.id === ownProps.params.id);

  // append starting event for post-remand and post-cavc remand appeals
  // NOTE: This is business logic pulled from v1 that we don't fully understand yet.
  //  Also, having this logic in mapStateToProps is less than ideal; we want to
  //  move it out when we know where it should live.
  if (appeal && appeal.attributes.type !== 'original' && appeal.attributes.prior_decision_date) {
    appeal.attributes.events.unshift({
      type: appeal.attributes.type === 'post_cavc_remand' ? 'cavc_decision' : 'bva_remand',
      date: appeal.attributes.prior_decision_date,
    });
  }

  return { appeal, loading };
}

const mapDispatchToProps = {
  getAppealsV2
};

export default connect(mapStateToProps, mapDispatchToProps)(AppealsV2StatusPage);

