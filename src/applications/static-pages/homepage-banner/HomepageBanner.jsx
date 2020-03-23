// Node modules.
import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
import sanitizeHtml from 'sanitize-html';
import yaml from 'js-yaml';
// Relative imports.
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';

const VAGOV_CONTENT =
  'https://raw.githubusercontent.com/department-of-veterans-affairs/vagov-content/master';

const HOMEPAGE_BANNER_YML_LOCATION = `${VAGOV_CONTENT}/fragments/home/banner.yml?cache-break=${new Date().getTime()}`;

const ACCEPTABLE_CONTENT_TAGS = [
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'li',
  'b',
  'i',
  'strong',
  'em',
  'hr',
  'br',
  'div',
  'span',
];

const HOMEPAGE_BANNER_LOCALSTORAGE = 'HOMEPAGE_BANNER';

class HomepageBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: null,
      dismissed: false,
    };
  }

  async componentDidMount() {
    try {
      const banner = await this.getConfig();
      this.processConfig(banner);
    } catch (error) {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`Homepage Banner Error: ${error.message}`);
      });
    }
  }

  async getConfig() {
    const response = await fetch(HOMEPAGE_BANNER_YML_LOCATION, {
      mode: 'cors',
    });

    const homepageBannerYml = await response.text();
    return yaml.safeLoad(homepageBannerYml);
  }

  processConfig(bannerConfig) {
    const type = sanitizeHtml(bannerConfig.type, {
      allowedTags: [],
    });

    const title = sanitizeHtml(bannerConfig.title, {
      allowedTags: ['b', 'i', 'strong', 'em'],
    });

    const content = sanitizeHtml(bannerConfig.content, {
      allowedTags: ACCEPTABLE_CONTENT_TAGS,
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesAppliedToAttributes: ['href', 'target', 'rel'],
    });

    const dismissed =
      localStorage.getItem(HOMEPAGE_BANNER_LOCALSTORAGE) ===
      this.prepareHomepageBannerID({ title, content });

    const banner = {
      visible: bannerConfig.visible,
      type,
      title,
      content,
    };

    this.setState({ banner, dismissed });
  }

  prepareHomepageBannerID = banner => `${banner.title}:${banner.content}`;

  dismiss = () => {
    localStorage.setItem(
      HOMEPAGE_BANNER_LOCALSTORAGE,
      this.prepareHomepageBannerID(this.state.banner),
    );
    this.setState({
      dismissed: true,
    });
  };

  render() {
    const { banner, dismissed } = this.state;

    // Derive banner properties.
    const content = banner?.content;
    const title = banner?.title;
    const type = banner?.type;
    const visible = banner?.visible;

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
