import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { findBenefitsRoute } from '../routes';

class DashboardAppWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalDismissed: false,
    };
  }

  dismissModal = () => {
    this.setState({
      modalDismissed: true,
    });
  };

  renderDowntimeNotification = (downtime, children) => {
    if (downtime.status === 'downtimeApproaching') {
      return (
        <div className="downtime-notification row-padded" data-status={status}>
          <Modal
            id="downtime-approaching-modal"
            title="Some parts of your homepage will be down for maintenance soon"
            status="info"
            onClose={this.dismissModal}
            visible={!this.state.modalDismissed}
          >
            <p>
              We’ll be making updates to some tools and features on{' '}
              {downtime.startTime.format('MMMM Do')} between{' '}
              {downtime.startTime.format('LT')} and{' '}
              {downtime.endTime.format('LT')} If you have trouble using parts of
              the dashboard during that time, please check back soon.
            </p>
            <button
              type="button"
              className="usa-button-secondary"
              onClick={this.dismissModal}
            >
              Continue
            </button>
          </Modal>
          {children}
        </div>
      );
    }
    return children;
  };

  renderBreadcrumbs = location => {
    const { pathname } = location;
    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <Link to="/" key="dashboard">
        My VA
      </Link>,
    ];

    if (pathname.match(findBenefitsRoute.path)) {
      crumbs.push(
        <Link
          to={`my-va/${findBenefitsRoute.path}`}
          key={findBenefitsRoute.path}
        >
          {findBenefitsRoute.name}
        </Link>,
      );
    }
    return crumbs;
  };

  render() {
    return (
      <RequiredLoginView
        serviceRequired={[backendServices.USER_PROFILE]}
        user={this.props.user}
      >
        <DowntimeNotification
          appTitle="user dashboard"
          dependencies={[
            externalServices.mvi,
            externalServices.mhv,
            externalServices.appeals,
          ]}
          render={this.renderDowntimeNotification}
        >
          <Breadcrumbs>
            {this.renderBreadcrumbs(this.props.location)}
          </Breadcrumbs>

          {this.props.children}
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

const mapStateToProps = state => {
  const userState = state.user;
  const profileState = userState.profile;

  return {
    profile: profileState,
    user: userState,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardAppWrapper);
export { DashboardAppWrapper };
