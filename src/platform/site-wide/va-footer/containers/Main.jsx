import React from 'react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import links from '../../../static-data/footer-links.json';
import { isWideScreen } from '../../../utilities/accessibility/index';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isMobile: false };
    this.linkObj = groupBy(links, 'column');
  }
  componentWillMount() {
    window.addEventListener('resize', () => {
      this.setState({
        isMobile: !isWideScreen()
      });
    }, false);

    this.setState({
      isMobile: !isWideScreen()
    });
  }
  generateLinkItems = (column, direction = 'asc') => (
    <ul className="va-footer-links">
      {orderBy(this.linkObj[column], 'order', direction).map(link =>
        <li key={`${link.column}-${link.order}`}><a href={link.href} target={link.target}>{link.title}</a></li>
      )}
    </ul>
  )
  buildContact = () => {
    let innerClassName = '';
    let buttonEnabled = '';
    let buttonClasses = '';
    if (this.state.isMobile) {
      innerClassName = 'usa-accordion-content';
      buttonEnabled = '';
      buttonClasses = 'usa-button-unstyled usa-accordion-button';

    } else {
      innerClassName = '';
      buttonEnabled = 'disabled';
      buttonClasses = 'va-footer-button';
    }
    if (this.state.isMobile) {
      return (
        [
          <ul key="veteran-crisis-line" className="va-footer-linkgroup usa-width-one-fourth usa-accordion" id="veteran-crisis-line" aria-hidden="true">
            <li>
              <h4 className="va-footer-linkgroup-title">
                <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-crisis" itemProp="name" aria-expanded="false">In Crisis? Get Help Now</button>
              </h4>
            </li>
            <li className="usa-accordion-content" id="veteran-crisis" aria-hidden="true">
              <ul className="va-footer-links">
                <li>
                  <button className="va-button-link va-overlay-trigger" data-show="#modal-crisisline">Veterans Crisis Line</button>
                </li>
              </ul>
            </li>
          </ul>,
          <ul className="va-footer-linkgroup usa-width-one-fourth usa-accordion" id="veteran-contact-us" key="veteran-contact-us" aria-hidden="true">
            <li id="footer-vcl">
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-contact" itemProp="name" aria-expanded="false">Contact Us</button>
              </h4>
            </li>
            <li className={innerClassName} id="veteran-contact" aria-hidden="true">
              {this.generateLinkItems('4')}
            </li>
          </ul>
        ]
      );
    }
    return (
      <ul className="va-footer-linkgroup usa-width-one-fourth" id="veteran-crisis" >
        <li>
          <h4 className="va-footer-linkgroup-title">
              In Crisis? Get Help Now
          </h4>
        </li>
        <li>
          <button className="va-button-link va-overlay-trigger" data-show="#modal-crisisline">Veterans Crisis Line</button>
        </li>
        <li id="footer-vcl">
          <h4 className="va-footer-linkgroup-title">
              Contact Us
          </h4>
        </li>
        <li id="veteran-contact" aria-hidden="true">
          {this.generateLinkItems('4')}
        </li>
      </ul>
    );
  }
  render() {
    // there is probably a better way to write this but I am going for fast, not elegant
    // hacky hacky
    const contactVCL = this.buildContact(this);

    let className = '';
    let innerClassName = '';
    let buttonEnabled = '';
    let buttonClasses = '';
    if (this.state.isMobile) {
      className = 'va-footer-linkgroup usa-width-one-fourth usa-accordion';
      innerClassName = 'usa-accordion-content';
      buttonEnabled = '';
      buttonClasses = 'usa-button-unstyled usa-accordion-button';

    } else {
      className = 'va-footer-linkgroup usa-width-one-fourth';
      innerClassName = '';
      buttonEnabled = 'disabled';
      buttonClasses = 'va-footer-button';
    }
    return (
      <div>
        <div className="footer-inner">
          <div className="usa-grid usa-grid-flex-mobile">
            <ul className={className} id="footer-first-child">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-programs" itemProp="name" aria-expanded="false">Veteran Programs and Services</button>
                </h4>
              </li>
              <li className={innerClassName} id="veteran-programs" aria-hidden="true">
                {this.generateLinkItems('1')}
              </li>
            </ul>
            <ul className={className} id="footer-services">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-resources" itemProp="name" aria-expanded="false">More VA Resources</button>
                </h4>
              </li>
              <li className={innerClassName} id="veteran-resources" aria-hidden="true">
                {this.generateLinkItems('2')}
              </li>
            </ul>
            <ul className={className} id="footer-popular">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-connect" itemProp="name" aria-expanded="false">Get VA Updates</button>
                </h4>
              </li>

              <li className={innerClassName} id="veteran-connect" aria-hidden="true">
                {this.generateLinkItems('3')}
              </li>
            </ul>
            {contactVCL}
          </div>
          <div className="usa-grid footer-banner">
            <a href="https://preview.va.gov" className="va-footer-logo" title="Go to VA.gov">
              <img src="/img/homepage/va-logo-white.png" alt="VA logo"/>
            </a>
          </div>
          <div className="usa-grid footer-links">
            <ul>
              {orderBy(this.linkObj.bottom_rail, 'order', 'asc').map(link => {
                return (<li key={`${link.order}`}><a href={link.href} target={link.target}>{link.title}</a></li>);
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default Main;
