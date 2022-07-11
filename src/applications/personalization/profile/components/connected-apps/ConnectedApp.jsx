import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';

import PropTypes from 'prop-types';

import { ConnectedAppDeleteModal } from './ConnectedAppDeleteModal';

export class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  confirmDelete = () => {
    this.props.confirmDelete(this.props.id);
  };

  render() {
    const { logo, title, grants } = this.props.attributes;

    return (
      <div
        className="connected-app border-box vads-u-display--flex vads-u-align-items--flex-start vads-u-padding--3 vads-u-border-color--gray-lighter vads-u-border--1px
        vads-u-margin-y--2"
      >
        <img
          className="va-connected-app-account-logo vads-u-margin-right--2p5"
          src={logo}
          alt=""
        />
        <div className="vads-u-flex--4 vads-u-align-items--flex-start">
          <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
            <div>
              <h2 className="vads-u-margin--0 vads-u-color--gray-dark vads-u-font-size--h3">
                {title}
              </h2>
              <p className="vads-u-margin-top--0p5">
                Connected on{' '}
                {moment(grants[0]?.created).format('MMMM D, YYYY h:mm A')}
              </p>
            </div>

            <button
              aria-label={`Disconnect ${title} from your account`}
              className="usa-button-secondary vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--0"
              onClick={this.openModal}
              data-testid={`disconnect-app-${this.props.id}`}
              type="button"
            >
              Disconnect
            </button>
          </div>

          <ConnectedAppDeleteModal
            deleting={this.props.deleting}
            title={title}
            modalOpen={this.state.modalOpen && isEmpty(this.props.errors)}
            closeModal={this.closeModal}
            confirmDelete={this.confirmDelete}
          />
          <va-additional-info trigger={`Learn about ${title}`} disable-border>
            <p>
              <strong>{title}</strong>
              &nbsp;can access:
            </p>
            <ul>
              {grants && grants.map((a, idx) => <li key={idx}>{a.title}</li>)}
            </ul>
          </va-additional-info>
        </div>
      </div>
    );
  }
}

ConnectedApp.propTypes = {
  confirmDelete: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  attributes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    grants: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
  deleting: PropTypes.bool,
  errors: PropTypes.array,
};
