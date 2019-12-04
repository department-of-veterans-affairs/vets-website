import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from './Breadcrumbs';
import { scrollAndFocus } from '../utils/scrollAndFocus';

export default class NewAppointmentLayout extends React.Component {
  componentDidMount() {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    scrollAndFocus();

    // We don't want people to start in the middle of the form, so redirect them when they jump
    // in the middle
    if (!this.props.location.pathname.endsWith('new-appointment')) {
      this.props.router.replace('/new-appointment');
    }
  }

  componentDidUpdate() {
    scrollAndFocus();
  }

  render() {
    const { children } = this.props;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
        <Breadcrumbs>
          <Link to="new-appointment">New appointment</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <span className="vaos-form__title vaos-u-margin-bottom--1 vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
              New appointment
            </span>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
