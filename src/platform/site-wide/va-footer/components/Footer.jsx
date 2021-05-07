import React from 'react';
import { isWideScreen } from '../../../utilities/accessibility/index';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';
import { createLinkGroups } from '../helpers';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

export default class Footer extends React.Component {
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
    // update font?
    return (
      <div>
        <div className="footer-inner">
          {/* add dividers between items */}
          <DesktopLinks visible={!this.state.isMobile} links={this.linkObj} />
          <MobileLinks visible={this.state.isMobile} links={this.linkObj} />
          {!this.state.isMobile && (
            <div className="usa-grid usa-grid-full va-footer-links-bottom">
              <h2 className="va-footer-linkgroup-title"> Language support</h2>
              <ul>
                {[
                  {
                    label: 'English',
                    suffix: '/',
                    lang: 'en',
                  },
                  {
                    onThisPage: 'En esta página',
                    label: 'Español',
                    suffix: '-esp/',
                    lang: 'es',
                  },
                  {
                    suffix: '-tag/',
                    label: 'Tagalog',
                    onThisPage: 'Sa pahinang ito',
                    lang: 'tl',
                  },
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      // onClick={captureEvent}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
