import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import recordEvent from '../../../../platform/monitoring/record-event';

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
    const { href, logo, title, created, grants } = this.props.attributes;
    const cssPrefix = 'va-connected-acct';
    const toggled = this.state.detailsOpen
      ? `${cssPrefix}-details-toggled`
      : '';
    const lastClass = this.props.isLast ? `${cssPrefix}-last-row` : '';
    return (
      <tr>
        <table className={`${cssPrefix}-row-table ${lastClass}`}>
          <tbody>
            <tr className={`${cssPrefix}-row ${toggled}`}>
              <th scope="row">
                <a href={href} className="no-external-icon">
                  <img src={logo} alt={`${title} logo`} width="100" />
                </a>
              </th>
              <th>
                Connected on {moment(created).format('MMMM D, YYYY h:mm A')}
              </th>
              <th className={`${cssPrefix}-row-details`}>
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
              </th>
            </tr>
            {this.state.detailsOpen && (
              <tr className={`${cssPrefix}-row-details-block`}>
                <th colSpan="3">
                  <div className={`${cssPrefix}-row-details-block-wrapper`}>
                    <div className={`${cssPrefix}-row-details-block-content`}>
                      <p>
                        <a href={href}>{title}</a>
                        &nbsp;can view your:
                        <button
                          aria-label={`Disconnect ${title} from your account`}
                          className="usa-button-primary"
                          onClick={this.openModal}
                        >
                          Disconnect
                        </button>
                      </p>
                      <ul>
                        {grants.map((a, idx) => (
                          <li key={idx}>{a.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </tr>
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
