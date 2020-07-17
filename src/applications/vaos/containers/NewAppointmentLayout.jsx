import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import localStorage from 'platform/utilities/storage/localStorage';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';

export class NewAppointmentLayout extends React.Component {
  componentDidMount() {
    if (this.props.isCernerOnlyPatient) {
      this.props.router.replace('/');
    }

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    window.addEventListener('beforeunload', this.onBeforeUnload);

    // We don't want people to start in the middle of the form, so redirect them when they jump
    // in the middle. We make an exception for the confirmation page in case someone is going back
    // after submitting.
    if (
      !this.props.location.pathname.endsWith('new-appointment') &&
      !this.props.location.pathname.endsWith('confirmation')
    ) {
      this.props.router.replace('/new-appointment');
    }
  }

  componentDidUpdate() {
    if (this.props.location.pathname.endsWith('confirmation')) {
      this.removeBeforeUnloadHook();
    }
  }

  componentWillUnmount() {
    this.removeBeforeUnloadHook();
  }

  onBeforeUnload = e => {
    const expirationDate = localStorage.getItem('sessionExpiration');

    // If there's no expiration date, then the session has already expired
    // and keeping a person on the form won't save their data
    if (expirationDate) {
      e.preventDefault();
      e.returnValue =
        'Are you sure you wish to leave this application? All progress will be lost.';
    }
  };

  removeBeforeUnloadHook = () => {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  };

  render() {
    const { children } = this.props;
    const isReviewPage = this.props.location.pathname.includes('review');

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
        <Breadcrumbs>
          <Link to="new-appointment">New appointment</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            {!isReviewPage && (
              <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
                New appointment
              </span>
            )}
            {children}
            <NeedHelp />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
  };
}

export default connect(mapStateToProps)(NewAppointmentLayout);
