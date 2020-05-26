// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import join from 'lodash/join';
import map from 'lodash/map';

export class SearchResult extends Component {
  static propTypes = {
    item: PropTypes.shape({
      appURL: PropTypes.string.isRequired,
      categories: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      iconURL: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      permissions: PropTypes.string.isRequired,
      platforms: PropTypes.string.isRequired,
      privacyPolicyURL: PropTypes.string.isRequired,
      reportAppURL: PropTypes.string.isRequired,
      termsOfServiceURL: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  setShow = show => {
    this.setState({ show });
  };

  render() {
    const { item } = this.props;
    const { setShow } = this;
    const { show } = this.state;

    return (
      <li className="third-party-app vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2 vads-u-padding--3 vads-u-border-color--gray-lightest vads-u-border--2px">
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
          {/* App Icon */}
          <img
            alt={item?.name}
            aria-hidden="true"
            role="presentation"
            src={item?.iconURL}
          />

          <div className="vads-u-flex--1 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--2">
            {/* App Name */}
            <h3
              className="vads-u-margin--0 vads-u-margin-bottom--0p5"
              id={item?.id}
            >
              {item?.name}
            </h3>

            {/* Category and Platform */}
            <p className="vads-u-margin--0">
              {join(item?.categories, ', ')} app available for{' '}
              {join(item?.platforms, ', ')}
            </p>
          </div>

          {/* App URL */}
          <a
            className="usa-button usa-button-secondary vads-u-width--auto"
            href={item?.appURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Find app
          </a>
        </div>

        {/* Toggle More Info */}
        <div className="learn-more">
          <button
            className="va-button-link vads-u-text-decoration--none vads-u-border-color--link-default vads-u-border-style--dotted vads-u-border-bottom--1px vads-u-margin-top--1p5"
            onClick={() => setShow(!show)}
            type="button"
          >
            Learn about {item?.name} <i className="fa fa-cenvron-down" />
          </button>
        </div>

        {show && (
          <>
            <hr />

            {/* Description */}
            <h4>About this app:</h4>
            <p className="vads-u-margin-bottom--0">{item?.description}</p>

            {/* Permissions */}
            <h4>{item?.name} asks for:</h4>
            <ol className="vads-u-margin--0 vads-u-padding-left--2p5">
              {map(item?.permissions, permission => (
                <li key={permission}>{permission}</li>
              ))}
            </ol>

            {/* Legal Links */}
            <h4>More information:</h4>
            <a
              href={item?.privacyPolicyURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              View privacy policy
            </a>
            <a
              className="vads-u-margin-top--1"
              href={item?.termsOfServiceURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              View terms of service
            </a>
            <a
              className="vads-u-margin-top--1"
              href={encodeURIComponent(
                `mailto:api@va.gov?subject=Report ${item?.name} to VA`,
              )}
              rel="noopener noreferrer"
            >
              Report this app to VA
            </a>
          </>
        )}
      </li>
    );
  }
}

export default SearchResult;
