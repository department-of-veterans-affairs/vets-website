// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
// Relative imports.
import { langSelectedAction } from 'applications/static-pages/i18Select/actions';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import LanguageSupport from './LanguageSupport';
import MobileLinks from './MobileLinks';
import { createLinkGroups } from '../helpers';
import { isWideScreen } from '../../../utilities/accessibility/index';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.linkObj = createLinkGroups(props.footerData);
    this.state = {
      isMobile: !isWideScreen(),
    };
  }

  componentDidMount() {
    window.addEventListener(
      'resize',
      debounce(() => {
        if (this.state.isMobile !== !isWideScreen()) {
          this.setState({
            isMobile: !isWideScreen(),
          });
        }
      }, 250),
      false,
    );

    this.props.onFooterLoad?.();
  }

  render() {
    // Temporary for verification of web components in injected header
    const { showWebComponents } = this.props;
    return (
      <div>
        {showWebComponents && (
          <VaModal status="warning" visible={false}>
            Test modal
          </VaModal>
        )}

        <div className="footer-inner">
          <DesktopLinks
            visible={!this.props.minimalFooter && !this.state.isMobile}
            links={this.linkObj}
          />
          <MobileLinks
            visible={this.state.isMobile}
            links={this.linkObj}
            langConfig={{
              dispatchLanguageSelection: this.props.dispatchLanguageSelection,
              languageCode: this.props.languageCode,
            }}
            minimalFooter={this.props.minimalFooter}
          />
          {!this.props.minimalFooter &&
            !this.state.isMobile && (
              <LanguageSupport
                isDesktop
                dispatchLanguageSelection={this.props.dispatchLanguageSelection}
                languageCode={this.props.languageCode}
              />
            )}

          <div className="usa-grid usa-grid-full footer-banner">
            <a href="/" title="Go to VA.gov">
              <img
                src={replaceWithStagingDomain(
                  'https://www.va.gov/img/homepage/va-logo-white.png',
                )}
                alt="VA logo and Seal, U.S. Department of Veterans Affairs"
                width="200"
                className="vads-u-height--auto"
              />
            </a>
          </div>
          {!this.props.minimalFooter && (
            <div className="usa-grid usa-grid-full va-footer-links-bottom">
              {this.linkObj.bottomLinks}
            </div>
          )}
        </div>
        <CrisisPanel />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  dispatchLanguageSelection: lang => dispatch(langSelectedAction(lang)),
});

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
  showWebComponents: toggleValues(state)[
    FEATURE_FLAG_NAMES.injectedHeaderWebComponents
  ],
});

Footer.propTypes = {
  footerData: PropTypes.arrayOf(PropTypes.object).isRequired,
  minimalFooter: PropTypes.bool.isRequired,
  dispatchLanguageSelection: PropTypes.func,
  languageCode: PropTypes.string,
  onFooterLoad: PropTypes.func,
  showWebComponents: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
