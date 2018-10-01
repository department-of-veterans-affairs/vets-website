import React from 'react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import links from '../../../static-data/footer-links.json';
import { isWideScreen, isEnter } from '../../../utilities/accessibility/index';
import recordEvent from '../../../monitoring/record-event';

const FOOTER_COLUMNS = {
  PROGRAMS: '1',
  RESOURCES: '2',
  CONNECT: '3',
  CONTACT: '4'
};

const FOOTER_EVENTS = {
  [FOOTER_COLUMNS.PROGRAMS]: 'nav-footer-programs',
  [FOOTER_COLUMNS.RESOURCES]: 'nav-footer-resources',
  [FOOTER_COLUMNS.CONNECT]: 'nav-footer-connect',
  [FOOTER_COLUMNS.CONTACT]: 'nav-footer-contact',
  CRISIS_LINE: 'nav-footer-crisis',
};

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
  openModal = () => {
    recordEvent({ event: FOOTER_EVENTS.CRISIS_LINE });
    this.setState({ modalOpen: true });
  }

  generateLinkItems = (column, direction = 'asc') => {
    const captureEvent = () => recordEvent({ event: FOOTER_EVENTS[column] });
    return (
      <ul className="va-footer-links">
        {orderBy(this.linkObj[column], 'order', direction).map(link =>
          <li key={`${link.column}-${link.order}`}><a href={link.href} onClick={captureEvent} target={link.target}>{link.title}</a></li>
        )}
      </ul>
    );
  }
  handleKeyPress = (e) => {
    if (isEnter(e)) {
      this.openModal();
    }
  }
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
                  <a role="button" tabIndex="0" onClick={this.openModal} onKeyPress={this.handleKeyPress} >Veterans Crisis Line</a>
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
              {this.generateLinkItems(FOOTER_COLUMNS.CONTACT)}
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
          <a role="button" tabIndex="0" onClick={this.openModal}  onKeyPress={this.handleKeyPress} >Veterans Crisis Line</a>
        </li>
        <li id="footer-vcl">
          <h4 className="va-footer-linkgroup-title">
              Contact Us
          </h4>
        </li>
        <li id="veteran-contact" aria-hidden="true">
          {this.generateLinkItems(FOOTER_COLUMNS.CONTACT)}
        </li>
      </ul>
    );
  }
  closeModal = () => {
    this.setState({ modalOpen: false });
  }
  renderModal() {
    return (
      <div id="modal-crisisline" className="va-overlay va-modal va-modal-large va-overlay--open" role="alertdialog">
        <div className="va-crisis-panel va-modal-inner">
          <h3>Get help from Veterans Crisis Line</h3>
          <button className="va-modal-close va-overlay-close" onClick={this.closeModal} type="button">
            <i className="fa fa-close va-overlay-close"></i>
            <span className="usa-sr-only va-overlay-close">Close this modal</span>
          </button>
          <div className="va-overlay-body va-crisis-panel-body">
            <ul>
              <li><a href="tel:18002738255">Call <strong>1-800-273-8255 (Press 1)</strong></a></li>
              <li><a href="sms:838255">Text to <b>838255</b></a></li>
              <li><a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat">Chat <b>confidentially now</b></a></li>
            </ul>
            <p>If you are in crisis or having thoughts of suicide,
      visit <a href="https://www.veteranscrisisline.net/">VeteransCrisisLine.net</a> for more resources.</p>
          </div>
        </div>
      </div>
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
        {this.state.modalOpen && this.renderModal()}
        <div className="footer-inner">
          <div className="usa-grid usa-grid-flex-mobile">
            <ul className={className} id="footer-first-child">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-programs" itemProp="name" aria-expanded="false">Veteran Programs and Services</button>
                </h4>
              </li>
              <li className={innerClassName} id="veteran-programs" aria-hidden="true">
                {this.generateLinkItems(FOOTER_COLUMNS.PROGRAMS)}
              </li>
            </ul>
            <ul className={className} id="footer-services">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-resources" itemProp="name" aria-expanded="false">More VA Resources</button>
                </h4>
              </li>
              <li className={innerClassName} id="veteran-resources" aria-hidden="true">
                {this.generateLinkItems(FOOTER_COLUMNS.RESOURCES)}
              </li>
            </ul>
            <ul className={className} id="footer-popular">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-connect" itemProp="name" aria-expanded="false">Get VA Updates</button>
                </h4>
              </li>

              <li className={innerClassName} id="veteran-connect" aria-hidden="true">
                {this.generateLinkItems(FOOTER_COLUMNS.CONNECT)}
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
