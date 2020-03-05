import yaml from 'js-yaml';
import * as Sentry from '@sentry/browser';
import sanitizeHtml from 'sanitize-html';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import React from 'react';
import classnames from 'classnames';

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
];

export default class HomepageBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: null,
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

  processConfig(banner) {
    const type = sanitizeHtml(banner.type, {
      allowedTags: [],
    });

    const title = sanitizeHtml(banner.title, {
      allowedTags: ['b', 'i', 'strong', 'em'],
    });

    const content = sanitizeHtml(banner.content, {
      allowedTags: ACCEPTABLE_CONTENT_TAGS,
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesAppliedToAttributes: ['href'],
    });

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      banner: { visible: banner.visible, type, title, content },
    });
  }

  dismiss = () => {};

  render() {
    if (!this.state.banner?.visible) {
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
          status="warning"
          content={wysiwygDiv}
        />
      </div>
    );
  }
}
