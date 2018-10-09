import React from 'react';
import groupBy from 'lodash/groupBy';
import links from '../../../static-data/footer-links.json';
import { isWideScreen } from '../../../utilities/accessibility/index';
import { replaceDomainsInData } from '../../../utilities/environment/stagingDomains';
import orderBy from 'lodash/orderBy';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import MobileLinks from './MobileLinks';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.linkObj = groupBy(replaceDomainsInData(links), 'column');
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
              <img src="/img/homepage/va-logo-white.png" alt="VA logo" />
            </a>
          </div>
          <div className="usa-grid usa-grid-full va-footer-links-bottom">
            <ul>
              {orderBy(this.linkObj.bottom_rail, 'order', 'asc').map(link => (
                <li key={`${link.order}`}>
                  <a href={link.href} target={link.target}>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <CrisisPanel />
      </div>
    );
  }
}
