// Node modules.
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import join from 'lodash/join';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import PropTypes from 'prop-types';
// Relative imports
import { SearchResultPropTypes } from '../../prop-types';
import { recordFindAppClick, recordInfoToggle } from '../../utils/analytics';

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

  setShow = (show, item) => {
    if (show) {
      this.setState({ learnIcon: 'up' });
      recordInfoToggle('expand', item.name, item.serviceCategories);
    } else {
      this.setState({ learnIcon: 'down' });
      recordInfoToggle('collapse', item.name, item.serviceCategories);
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
          <img alt={`${item?.name} icon`} src={item?.logoUrl} />

          <div className="vads-u-flex--1 vads-u-display--flex vads-u-flex-direction--column vads-u-margin-left--2">
            {/* App Name */}
            <h2
              className="vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-font-size--h3"
              data-e2e-id="result-title"
              id={item?.id}
            >
              {item?.name}
            </h2>

            {/* Category and Platform */}
            <p className="vads-u-margin--0">
              {join(item?.serviceCategories, ', ') || 'Unknown category'} app
              available for{' '}
              {convertPlatform(item?.platforms) || 'unknown platforms'}
            </p>
          </div>

          {/* App URL */}
          <a
            aria-label={`Find app ${item.name}`}
            className="usa-button usa-button-secondary vads-u-width--auto"
            href={item?.appUrl}
            onClick={e =>
              recordFindAppClick(e, item.name, item.service_categories)
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            Find app
          </a>
        </div>

        {/* Toggle More Info */}
        <div className="learn-more">
          <button
            aria-expanded={show}
            className="va-button-link vads-u-text-decoration--none vads-u-margin-top--1p5 vads-u-display--block"
            onClick={() => {
              setShow(!show, item);
            }}
            type="button"
          >
            <span className="additional-info-title">
              Learn about {item?.name}{' '}
              {learnIcon === 'down' ? (
                <va-icon icon="expand_more" size={3} />
              ) : (
                <va-icon icon="expand_less" size={3} />
              )}
            </span>
          </button>
        </div>
        {show && (
          <div>
            <hr aria-hidden="true" />

            {/* Description */}
            {item?.description && (
              <>
                <h3 className="vads-u-font-size--h4">About this app:</h3>
                <p className="vads-u-margin-bottom--0">{item?.description}</p>
              </>
            )}

            {/* Legal Links */}
            <a
              className="vads-u-margin-top--3 vads-u-display--block"
              href={item?.privacyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`View the ${item.name} privacy policy`}
            </a>
            <a
              className="vads-u-margin-top--1 vads-u-display--block"
              href={item?.tosUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`View the ${item.name} terms of service`}
            </a>
            <a
              className="vads-u-margin-top--1  vads-u-margin-bottom--1 vads-u-display--block"
              href={`mailto:api@va.gov?subject=Report ${item?.name} to VA`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`Report ${item.name} to VA`}
            </a>

            {/* Permissions */}
            {!isEmpty(scopes) && (
              <>
                <h3 className="vads-u-font-size--h4">
                  {item?.name} may request access to your VA information,
                  including:
                </h3>
                <ul
                  aria-label={`${item.name} - potential data requests`}
                  className="vads-u-margin--0 vads-u-margin-top--2 vads-u-padding-left--2p5"
                >
                  {reduce(
                    item?.serviceCategories,
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
                </ul>
              </>
            )}
          </div>
        )}
      </li>
    );
  }
}

export default SearchResult;
