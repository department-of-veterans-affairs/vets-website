/* eslint-disable camelcase */

// Node modules.
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import PropTypes from 'prop-types';
// Relative imports
import { SearchResultPropTypes } from '../../prop-types';

export class SearchResult extends Component {
  static propTypes = {
    item: SearchResultPropTypes,
    scopes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      learnIcon: 'down',
      show: false,
    };
  }

  setShow = show => {
    if (show) {
      this.setState({ learnIcon: 'up' });
    } else {
      this.setState({ learnIcon: 'down' });
    }
    this.setState({ show });
  };

  render() {
    const { item, scopes } = this.props;
    const { setShow } = this;
    const { learnIcon, show } = this.state;

    const convertPlatform = platforms => {
      const updatedWeb = map(platforms, platform => {
        return platform === 'Web' ? 'web browsers' : platform;
      });
      return join(updatedWeb, ', ');
    };

    return (
      <li className="third-party-app vads-u-display--flex vads-u-flex-direction--column vads-u-margin-bottom--2 vads-u-padding--3 vads-u-border-color--gray-lightest vads-u-border--2px">
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
          {/* App Icon */}
          <img alt={`${item?.name} icon`} src={item?.logo_url} />

          <div className="vads-u-flex--1 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--2">
            {/* App Name */}
            <h3
              className="vads-u-margin--0 vads-u-margin-bottom--0p5"
              data-e2e-id="result-title"
              id={item?.id}
            >
              {item?.name}
            </h3>

            {/* Category and Platform */}
            <p className="vads-u-margin--0">
              {join(item?.service_categories, ', ') || 'Unknown category'} app
              available for{' '}
              {convertPlatform(item?.platforms) || 'unknown platforms'}
            </p>
          </div>

          {/* App URL */}
          <a
            className="usa-button usa-button-secondary vads-u-width--auto"
            href={item?.app_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Find app
          </a>
        </div>

        {/* Toggle More Info */}
        <div className="learn-more">
          <button
            className="va-button-link vads-u-text-decoration--none vads-u-margin-top--1p5"
            onClick={() => {
              setShow(!show, item?.service_categories);
            }}
            type="button"
          >
            <span className="additional-info-title">
              Learn about {item?.name}{' '}
              <i className={`fa fa-chevron-${learnIcon}`} />
            </span>
          </button>
        </div>
        {show && (
          <>
            <hr />

            {/* Description */}
            {item?.description && (
              <>
                <h4>About this app:</h4>
                <p className="vads-u-margin-bottom--0">{item?.description}</p>
              </>
            )}

            {/* Legal Links */}
            <a
              className="vads-u-margin-top--2"
              href={item?.privacy_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              View the privacy policy
            </a>
            <a
              className="vads-u-margin-top--1"
              href={item?.tos_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              View terms of service
            </a>
            <a
              className="vads-u-margin-top--1"
              href={`mailto:api@va.gov?subject=Report ${item?.name} to VA`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Report this app to VA
            </a>

            {/* Permissions */}
            {!isEmpty(scopes) && (
              <>
                <h4>
                  {item?.name} may request access to your VA information,
                  including:
                </h4>
                <ol className="vads-u-margin--0 vads-u-margin-top--1 vads-u-padding-left--2p5">
                  {reduce(
                    item?.service_categories,
                    (allPermissions, scope) => {
                      const currentPermissions = map(
                        scopes[scope],
                        permission => (
                          <li key={permission.name}>
                            {permission.displayName}
                          </li>
                        ),
                      );
                      return [...allPermissions, ...currentPermissions];
                    },
                    [],
                  )}
                </ol>
              </>
            )}
          </>
        )}
      </li>
    );
  }
}

export default SearchResult;
