import React from 'react';
import { debounce } from 'lodash';
import { isWideScreen } from '../../../utilities/accessibility/index';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';
import LanguageSupport from './LanguageSupport';
import { createLinkGroups } from '../helpers';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import { connect } from 'react-redux';
import { langSelectedAction } from 'applications/static-pages/i18Select/actions';

class Footer extends React.Component {
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
    if (this.props.handleFooterDidMount) {
      this.props.handleFooterDidMount();
    }
  }
  render() {
    return (
      <div>
        <div className="footer-inner">
          <DesktopLinks visible={!this.state.isMobile} links={this.linkObj} />
          <MobileLinks
            visible={this.state.isMobile}
            links={this.linkObj}
            langConfig={{
              dispatchLanguageSelection: this.props.dispatchLanguageSelection,
              languageCode: this.props.languageCode,
            }}
          />
          {!this.state.isMobile && (
            <LanguageSupport
              isDesktop
              dispatchLanguageSelection={this.props.dispatchLanguageSelection}
              languageCode={this.props.languageCode}
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
const mapDispatchToProps = dispatch => ({
  dispatchLanguageSelection: lang => dispatch(langSelectedAction(lang)),
});

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
