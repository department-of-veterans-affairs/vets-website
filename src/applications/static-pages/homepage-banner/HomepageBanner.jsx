import React from 'react';
import * as Sentry from '@sentry/browser';
import classnames from 'classnames';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import sanitizeHtml from 'sanitize-html';
import yaml from 'js-yaml';
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

export default class HomepageBanner extends React.Component {
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
      localStorage.getItem(HOMEPAGE_BANNER_LOCALSTORAGE) === bannerConfig.title;

    const banner = {
      visible: bannerConfig.visible,
      type,
      title,
      content,
    };

    this.setState({ banner, dismissed });
  }

  dismiss = () => {
    localStorage.setItem(HOMEPAGE_BANNER_LOCALSTORAGE, this.state.banner.title);
    this.setState({
      dismissed: true,
    });
  };

  render() {
    if (!this.state.banner?.visible || this.state.dismissed) {
      return null;
    }

    const fullWidthBannerClass = classnames(
      'usa-alert-full-width',
      `usa-alert-full-width-${this.state.banner?.type}`,
    );

    const wysiwygDiv = (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: this.state.banner?.content }} />
    );

    return (
      <div className={fullWidthBannerClass}>
        <AlertBox
          isVisible
          onCloseAlert={this.dismiss}
          status={this.state.banner?.type}
          headline={this.state.banner?.title}
          content={wysiwygDiv}
        />
      </div>
    );
  }
}
