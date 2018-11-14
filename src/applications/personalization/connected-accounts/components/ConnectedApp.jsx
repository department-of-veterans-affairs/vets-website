import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import { AccountModal } from './AccountModal';

class ConnectedApp extends React.Component {
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
    const { href, logo, title, created, grants } = this.props.attributes;
    return (
      <tr>
        <th scope="row">
          <a href={href} className="no-external-icon">
            <img src={logo} alt={`${title} logo`} width="100" />
          </a>
        </th>
        <th>
          <a href={href}>{title}</a> <br />
          Connected at {moment(created).format('MMMM Do, YYYY')}
          <ul>
            {grants.map((a, idx) => (
              <li key={idx}>{a.title}</li>
            ))}
          </ul>
        </th>
        <th>
          <button className="usa-button-primary" onClick={this.openModal}>
            Disconnect
          </button>
        </th>
        <AccountModal
          appName={title}
          modalOpen={this.state.modalOpen}
          onCloseModal={this.closeModal}
          onConfirmDelete={this.confirmDelete}
          propertyName={this.props.propertyName}
        />
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
};

export { ConnectedApp };
