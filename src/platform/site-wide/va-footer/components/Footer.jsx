import React from 'react';
import { isWideScreen } from '../../../utilities/accessibility/index';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';
import LanguageSupport from './LanguageSupport';
import { createLinkGroups } from '../helpers';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.linkObj = createLinkGroups(props.footerData);
    this.state = {
      isMobile: !isWideScreen(),
    };
  }
  componentDidMount() {
    // TODO: debounce
    window.addEventListener(
      'resize',
      () => {
        if (this.state.isMobile !== !isWideScreen()) {
          this.setState({
            isMobile: !isWideScreen(),
          });
        }
      },
      false,
    );
    if (this.props.handleFooterDidMount) {
      this.props.handleFooterDidMount();
    }
  }
  render() {
    console.log(this.props.showLangSupport, 'FFFLAG');

    return (
      <div>
        <div className="footer-inner">
          <DesktopLinks visible={!this.state.isMobile} links={this.linkObj} />
          <MobileLinks
            visible={this.state.isMobile}
            links={this.linkObj}
            showLangSupport={this.props.showLangSupport}
          />
          {!this.state.isMobile && (
            <LanguageSupport
              showLangSupport={this.props.showLangSupport}
              isDesktop
            />
          )}

          <div className="usa-grid usa-grid-full footer-banner">
            <a href="/" className="va-footer-logo" title="Go to VA.gov">
              <img
                src={replaceWithStagingDomain(
                  'https://www.va.gov/img/homepage/va-logo-white.png',
                )}
                alt="VA logo"
              />
            </a>
          </div>
          <div className="usa-grid usa-grid-full va-footer-links-bottom">
            {this.linkObj.bottomLinks}
          </div>
        </div>
        <CrisisPanel />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  showLangSupport: toggleValues(store)[FEATURE_FLAG_NAMES.languageSupport],
});

export default connect(mapStateToProps)(Footer);
