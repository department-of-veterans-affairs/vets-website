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
            <tr
              className={`${cssPrefix}-row ${toggled}`}
              onClick={this.toggleDetails}
            >
              <th scope="row">
                <a href={href} className="no-external-icon">
                  <img src={logo} alt={`${title} logo`} width="100" />
                </a>
              </th>
              <th>Connected on {moment(created).format('MMMM Do, YYYY')}</th>
              <th className={`${cssPrefix}-row-details `}>
                <a className={`${cssPrefix}-row-details-toggle`} href="#">
                  Details
                  <i
                    className={`fa fa-chevron-${
                      this.state.detailsOpen ? 'down' : 'right'
                    }`}
                  />
                </a>
                <AccountModal
                  appName={title}
                  modalOpen={this.state.modalOpen}
                  onCloseModal={this.closeModal}
                  onConfirmDelete={this.confirmDelete}
                  propertyName={this.props.propertyName}
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
                        &nbsp;has access to the following information:
                        <button
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
  attribtues: PropTypes.object.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  propertyName: PropTypes.string.isRequired,
  isLast: PropTypes.bool,
};

export { ConnectedApp };
