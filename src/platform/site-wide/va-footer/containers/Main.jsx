import React from 'react';
import { connect } from 'react-redux';

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isMobile: false };
  }

  componentWillMount() {

    function setSize(t) {

      window.addEventListener('resize', () => {
        t.setState({
          isMobile: window.innerWidth < 767
        });
      }, false);

      t.setState({
        isMobile: window.innerWidth < 767
      });
    }

    setSize(this);

  }

  render() {

    // there is probably a better way to write this but I am going for fast, not elegant
    let className = '';
    let innerClassName = '';
    let buttonEnabled = '';
    let buttonClasses = '';

    function buildContact(t) {
      if (t.state.isMobile) {
        return (
          <div>
            <ul className="va-footer-linkgroup usa-width-one-fourth usa-accordion" id="veteran-crisis-line" aria-hidden="true">
              <li>
                <h4 className="va-footer-linkgroup-title">
                  <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-crisis" itemProp="name" aria-expanded="false">In Crisis? Get Help Now</button>
                </h4>
              </li>
              <li className="usa-accordion-content" id="veteran-crisis" aria-hidden="true">
                <ul className="va-footer-links">
                  <li>
                    <a href="http://www.veteranscrisisline.net/">Veterans Crisis Line</a>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="va-footer-linkgroup usa-width-one-fourth usa-accordion" id="veteran-contact-us" aria-hidden="true">
              <li id="footer-vcl">
                <h4 className="va-footer-linkgroup-title">
                  <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-contact" itemProp="name" aria-expanded="false">Contact Us</button>
                </h4>
              </li>
              <li className={innerClassName} id="veteran-contact" aria-hidden="true">
                <ul className="va-footer-links">
                  <li><a href="#">Find a VA Location</a></li>
                  <li><a href="#">Submit a Help Request</a></li>
                  <li><a href="#">Go to VA Help Center</a></li>
                  <li><a href="#">Call Us</a></li>
                </ul>
              </li>
            </ul>
          </div>
        );
      }
      return (
        <ul className="va-footer-linkgroup usa-width-one-fourth" id="veteran-crisis" aria-hidden="true">
          <li>
            <h4 className="va-footer-linkgroup-title">
              In Crisis? Get Help Now
            </h4>
          </li>
          <li>
            <a href="http://www.veteranscrisisline.net/">Veterans Crisis Line</a>
          </li>
          <li id="footer-vcl">
            <h4 className="va-footer-linkgroup-title">
              Contact Us
            </h4>
          </li>
          <li id="veteran-contact" aria-hidden="true">
            <ul className="va-footer-links">
              <li><a href="#">Find a VA Location</a></li>
              <li><a href="#">Submit a Help Request</a></li>
              <li><a href="#">Go to VA Help Center</a></li>
              <li><a href="#">Call Us</a></li>
            </ul>
          </li>
        </ul>
      );

    }

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

    // hacky hacky
    const contactVCL = buildContact(this);

    return (
      <div className="footer-inner">

        <div className="usa-grid">

          <ul className={className} id="footer-first-child">
            <li>
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-programs" itemProp="name" aria-expanded="false">Veteran Programs and Services</button>
              </h4>
            </li>
            <li className={innerClassName} id="veteran-programs" aria-hidden="true">
              <ul className="va-footer-links">
                <li><a href="#">For Homeless Veterans</a></li>
                <li><a href="#">For Women Veterans</a></li>
                <li><a href="#">For Minority Veterans</a></li>
                <li><a href="#">PTSD</a></li>
                <li><a href="#">Mental Health</a></li>
                <li><a href="#">Adaptive Sports and Special Events</a></li>
                <li><a href="#">Veterans Service Organizations (VSO)</a></li>
                <li><a href="#">State Veterans Affairs Offices</a></li>
                <li><a href="#">National Resource Directory</a></li>
                <li><a href="#">Print Your VA Welcome Kit</a></li>
              </ul>
            </li>
          </ul>

          <ul className={className} id="footer-services">

            <li>
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-resources" itemProp="name" aria-expanded="false">More VA Resources</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-resources" aria-hidden="true">
              <ul className="va-footer-links">
                <li><a href="#">Find a VA Form</a></li>
                <li><a href="#">Get VA Mobile Apps</a></li>
                <li><a href="#">Careers at VA</a></li>
                <li><a href="#">Doing Business with VA</a></li>
                <li><a href="#">Grants Management Services</a></li>
                <li><a href="#">VA Claims Accreditation</a></li>
                <li><a href="#">VA Information Technology and PIV Card</a></li>
              </ul>
            </li>

          </ul>

          <ul className={className} id="footer-popular">
            <li>
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-connect" itemProp="name" aria-expanded="false">Connect with Us</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-connect" aria-hidden="true">
              <ul className="va-footer-links">
                <li><a href="#">VAntage Point Blog</a></li>
                <li><a href="#">Email Updates</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Flickr</a></li>
                <li><a href="#">YouTube</a></li>
              </ul>
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
            <li><a href="#">Accessibility</a> | </li>
            <li><a href="#">FOIA</a> | </li>
            <li><a href="#">Inspector General</a> | </li>
            <li><a href="#">No FEAR Act</a> | </li>
            <li><a href="#">Notices</a> | </li>
            <li><a href="#">Plain Language</a> | </li>
            <li><a href="#">Privacy</a> | </li>
            <li><a href="#">Regulations</a> | </li>
            <li><a href="#">Site Index</a> | </li>
            <li><a href="#">USA.gov</a> | </li>
            <li><a href="#">VA.gov Playbook</a> | </li>
            <li><a href="#">Web Policies</a> | </li>
            <li><a href="#">Whistleblower Rights and Protections</a> | </li>
            <li><a href="#">White House</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapDispatchToProps)(Main);
