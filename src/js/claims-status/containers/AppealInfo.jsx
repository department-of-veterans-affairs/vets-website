import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';

import Breadcrumbs from '../components/Breadcrumbs';
import AppealsV2TabNav from '../components/appeals-v2/AppealsV2TabNav';

function isolateAppeal(state, id) {
  const claimsState = state.disability.status;
  const { appeals } = claimsState.claims;
  const appeal = appeals.find(a => a.id === id);

  // append starting event for post-remand and post-cavc remand appeals
  // NOTE: This is business logic pulled from v1 that we don't fully understand yet.
  //  Also, having this logic in mapStateToProps is less than ideal; we want to
  //  move it out when we know where it should live. Maybe just a helper.
  if (appeal && appeal.attributes.type !== 'original' && appeal.attributes.prior_decision_date) {
    appeal.attributes.events.unshift({
      type: appeal.attributes.type === 'post_cavc_remand' ? 'cavc_decision' : 'bva_remand',
      date: appeal.attributes.prior_decision_date,
    });
  }

  return appeal;
}

class AppealInfo extends React.Component {
  render() {
    const { params, children } = this.props;
    const appealId = params.id;
    // TODO: Make sure this is where we should get the date from
    const appealDate = this.props.appeal ? moment(this.props.appeal.attributes.events[0].date, 'YYYY-MM-DD').format('MMMM YYYY') : '';
    return (
      <div>
        <div className="row">
          <Breadcrumbs>
            <li><Link to="your-claims">Your Claims and Appeals</Link></li>
            <li><strong>Appeal of {appealDate} Claim Decision</strong></li>
          </Breadcrumbs>
        </div>
        <div className="row">
          <div className="medium-8 columns">
            <AppealsV2TabNav appealId={appealId}/>
            <div className="va-tab-content va-appeals-content">
              {React.Children.map(children, child => React.cloneElement(child, { appeal: this.props.appeal }))}
            </div>
          </div>
          {/* This assumes the Need Help sidebar doesn't change for either page */}
        </div>
      </div>
    );
  }
}

AppealInfo.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  children: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    appeal: isolateAppeal(state, ownProps.params.id)
  };
}

export default connect(mapStateToProps)(AppealInfo);
