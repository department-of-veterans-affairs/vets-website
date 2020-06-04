// Node modules.
import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
// Relative imports.
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';

const HOMEPAGE_BANNER_LOCALSTORAGE = 'HOMEPAGE_BANNER';

class HomepageBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed:
        localStorage.getItem(HOMEPAGE_BANNER_LOCALSTORAGE) ===
        this.prepareHomepageBannerID(),
    };
  }

  prepareHomepageBannerID = () =>
    `${this.props.bannerTitle}:${this.props.bannerContent}`;

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
    const {
      bannerTitle: title,
      bannerContent: content,
      bannerType: type,
      bannerVisible: visible,
    } = this.props;

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
          `usa-alert-full-width-${type}`,
        )}
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
