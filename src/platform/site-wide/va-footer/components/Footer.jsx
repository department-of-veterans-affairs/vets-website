import React from 'react';
import links from '../../../static-data/footer-links.json';
import { isWideScreen } from '../../../utilities/accessibility/index';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';
import { createLinkGroups } from '../helpers';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.linkObj = createLinkGroups(links);
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
    return (
      <div>
        <div className="footer-inner">
          <DesktopLinks visible={!this.state.isMobile} links={this.linkObj} />
          <MobileLinks visible={this.state.isMobile} links={this.linkObj} />
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
