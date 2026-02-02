import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { format } from 'date-fns';

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
        className="connected-app border-box vads-l-grid-container vads-u-align-items--flex-start vads-u-padding--3 vads-u-border-color--gray-lighter vads-u-border--1px
        vads-u-margin-y--2 vads-u-display--block mobile-lg:vads-u-display--flex"
      >
        <div className="small-screen:vads-l-col--2 mobile-lg:vads-u-text-align--center vads-u-text-align--left">
          <img
            className="va-connected-app-account-logo vads-u-margin-right--2p5 vads-u-margin-bottom--1"
            src={logo}
            alt=""
          />
        </div>
        <div className="vads-u-flex--4 vads-u-align-items--flex-start">
          <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
            <div>
              <h2 className="vads-u-margin--0 vads-u-color--gray-dark vads-u-font-size--h3 vads-u-padding-right--1px">
                {title}
              </h2>
              <p className="vads-u-margin-top--0p5">
                {`Connected on ${format(
                  new Date(grants[0]?.created),
                  'MMMM d, yyyy h:mm a',
                )}`}
              </p>
            </div>

            <va-button
              aria-label={`Disconnect ${title} from your account`}
              class="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--0"
              onClick={this.openModal}
              data-testid={`disconnect-app-${this.props.id}`}
              text="Disconnect"
              secondary
            />
          </div>

          <ConnectedAppDeleteModal
            deleting={this.props.deleting}
            title={title}
            modalOpen={this.state.modalOpen && isEmpty(this.props.errors)}
            closeModal={this.closeModal}
            confirmDelete={this.confirmDelete}
          />
          <va-additional-info
            trigger={`Learn about ${title}`}
            disable-border
            uswds
          >
            <div>
              <p className="vads-u-margin-y--0">
                <strong>{title}</strong>
                &nbsp;can access:
              </p>
              <ul className="vads-u-margin-top--0">
                {grants && grants.map((a, idx) => <li key={idx}>{a.title}</li>)}
              </ul>
            </div>
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
