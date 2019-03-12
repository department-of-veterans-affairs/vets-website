import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

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
      <div
        className={`${cssPrefix}-row ${toggled} ${lastClass}`}
        onClick={this.toggleDetails}
      >
        <img
          className={`${cssPrefix}-account-logo`}
          src={logo}
          alt={`${title} logo`}
        />
        <div>Connected on {moment(created).format('MMMM D, YYYY h:mm A')}</div>
        <div className={`${cssPrefix}-row-details `}>
          <a className={`${cssPrefix}-row-details-toggle`} href="#">
            Details
            <i
              className={`fa fa-chevron-${
                this.state.detailsOpen ? 'up' : 'down'
              }`}
            />
          </a>
          <AccountModal
            appName={title}
            modalOpen={this.state.modalOpen}
            onCloseModal={this.closeModal}
            onConfirmDelete={this.confirmDelete}
          />
        </div>
        {this.state.detailsOpen && (
          <div className={`${cssPrefix}-row-details-block`}>
            <div className={`${cssPrefix}-row-details-block-wrapper`}>
              <div className={`${cssPrefix}-row-details-block-content`}>
                <p>
                  <strong>{title}</strong>
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
          </div>
        )}
      </div>
    );
  }
}

ConnectedApp.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  attribtues: PropTypes.object.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
};

export { ConnectedApp };
