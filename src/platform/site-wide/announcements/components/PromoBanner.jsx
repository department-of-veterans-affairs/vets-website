import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const PROMO_BANNER_TYPES = {
  announcement: 'announcement',
  news: 'news',
  emailSignup: 'email-signup',
};

const PROMO_BANNER_ICONS = new Map([
  [PROMO_BANNER_TYPES.announcement, 'fa-bullhorn'],
  [PROMO_BANNER_TYPES.news, 'fa-newspaper'],
  [PROMO_BANNER_TYPES.emailSignup, 'fa-envelope'],
]);

class PromoBanner extends React.Component {
  render() {
    const iconClasses = classnames(
      'fas',
      'fa-stack-1x',
      PROMO_BANNER_ICONS.get(this.props.type),
    );

    return (
      <div className="va-promo-banner">
        <div className="usa-grid-full">
          <div className="va-promo-banner-body">
            <div className="va-promo-banner-content">
              <div className="va-promo-banner-content-icon">
                <span className="fa-stack fa-lg">
                  <i className="vads-u-color--white fa fa-circle fa-stack-2x" />
                  <i className={iconClasses} />
                </span>
              </div>

              {this.props.render ? (
                this.props.render()
              ) : (
                <a
                  className="va-promo-banner-content-link"
                  href={this.props.href}
                  onClick={this.props.onClose}
                >
                  {this.props.text}{' '}
                  <i className="fas fa-angle-right fa-lg vads-u-margin-left--1" />
                </a>
              )}
            </div>

            <div className="va-promo-banner-close">
              <button
                type="button"
                aria-label="Dismiss this announcement"
                onClick={this.props.onClose}
                className="va-button-link vads-u-margin-top--1"
              >
                <i className="fas fa-times-circle vads-u-font-size--lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PromoBanner.propTypes = {
  type: PropTypes.oneOf(Object.values(PROMO_BANNER_TYPES)).isRequired,
  onClose: PropTypes.func.isRequired,
  render: PropTypes.func,
  href: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
};

export default PromoBanner;

export { PROMO_BANNER_TYPES };
