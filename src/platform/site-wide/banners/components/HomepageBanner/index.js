// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
// Relative imports.
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';

const HOMEPAGE_BANNER_LOCALSTORAGE = 'HOMEPAGE_BANNER';

export class HomepageBanner extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dismissed:
        localStorage.getItem(HOMEPAGE_BANNER_LOCALSTORAGE) ===
        this.prepareHomepageBannerID(),
    };
  }

  prepareHomepageBannerID = () => `${this.props.title}:${this.props.content}`;

  dismiss = () => {
    localStorage.setItem(
      HOMEPAGE_BANNER_LOCALSTORAGE,
      this.prepareHomepageBannerID(),
    );
    this.setState({
      dismissed: true,
    });
  };

  render() {
    const { title, content, type, visible } = this.props;

    const { dismissed } = this.state;

    // Escape early if the banner isn't visible or is dismissed.
    if (!visible || dismissed) {
      return null;
    }

    // Derive onCloseAlert depending on the environment.
    const onCloseAlert = !environment.isProduction() && this.dismiss;

    return (
      <div
        className={classnames(
          'usa-alert-full-width',
          'vads-u-border-top--5px',
          'medium-screen:vads-u-border-top--10px',
          'homepage-banner',
          {
            'vads-u-border-color--warning-message': type !== 'error',
            'vads-u-border-color--secondary': type === 'error',
          },
        )}
        data-e2e-id="homepage-banner"
      >
        <AlertBox
          // eslint-disable-next-line react/no-danger
          content={<div dangerouslySetInnerHTML={{ __html: content }} />}
          headline={title}
          isVisible
          onCloseAlert={onCloseAlert}
          status={type}
        />
      </div>
    );
  }
}

export default HomepageBanner;
