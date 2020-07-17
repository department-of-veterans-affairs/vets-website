import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { AccountModal } from './AccountModal';

class ConnectedApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, detailsOpen: false };
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  confirmDelete = () => {
    recordEvent({
      event: 'account-navigation',
      'account-action': 'disconnect-button',
      'account-section': 'connected-accounts',
    });
    this.props.confirmDelete(this.props.id);
    this.closeModal();
  };

  toggleDetails = () => {
    this.setState({ detailsOpen: !this.state.detailsOpen });
  };

  render() {
    const { logo, title, created, grants } = this.props.attributes;
    const cssPrefix = 'va-connected-acct';
    const toggled = this.state.detailsOpen
      ? `${cssPrefix}-details-toggled`
      : '';
    const lastClass = this.props.isLast ? `${cssPrefix}-last-row` : '';
    return (
      <li className={`${cssPrefix}-row ${toggled} ${lastClass}`}>
        <img
          className={`${cssPrefix}-account-logo`}
          src={logo}
          alt={`${title} logo`}
        />
        <div>
          <h2 className={`${cssPrefix}-app-title`}>{title}</h2>
          <div>
            Connected on {moment(created).format('MMMM D, YYYY h:mm A')}
          </div>
        </div>
        <div className={`${cssPrefix}-row-details `}>
          <button
            className={`${cssPrefix}-row-details-toggle va-button-link`}
            aria-expanded={this.state.detailsOpen ? 'true' : 'false'}
            onClick={this.toggleDetails}
          >
            Details
            <i
              className={`fa fa-chevron-${
                this.state.detailsOpen ? 'up' : 'down'
              }`}
            />
          </button>
          <AccountModal
            appName={title}
            modalOpen={this.state.modalOpen}
            onCloseModal={this.closeModal}
            onConfirmDelete={this.confirmDelete}
          />
        </div>
        {this.state.detailsOpen && (
          <div className={`${cssPrefix}-row-details-block`}>
            <div className={`${cssPrefix}-row-details-block-content`}>
              <p>
                <button
                  aria-label={`Disconnect ${title} from your account`}
                  className="usa-button-primary"
                  onClick={this.openModal}
                >
                  Disconnect
                </button>
                <strong>{title}</strong>
                &nbsp;can view your:
              </p>
              <ul>
                {grants.map((a, idx) => (
                  <li key={idx}>{a.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </li>
    );
  }
}

ConnectedApp.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
};

export { ConnectedApp };
