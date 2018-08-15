import React from 'react';
import { connect } from 'react-redux';
import CollapsiblePanel from '@department-of-veterans-affairs/formation/CollapsiblePanel';

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isMobile: false};

    //{date: new Date()};
  }

  // check for and set state on mount
  // bring in the footer code (hardcoded for now)
  // set and unset dynamic classes depending on window resize
  // those classes should trigger uswds' accordion code
  // you might need to rewrite the markup

  componentDidMount() {

    console.log('state your width: ', window.innerWidth, this.state.isMobile);
    window.addEventListener('resize', () => {
      this.setState({
        isMobile: window.innerWidth < 767
      });
    }, false);

    this.setState({
      isMobile: window.innerWidth < 767
    });
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }


  render() {
    const className = this.state.isMobile ? 'va-footer-linkgroup usa-width-one-fourth usa-accordion' : 'va-footer-linkgroup usa-width-one-fourth';
    const innerClassName = this.state.isMobile ? 'usa-accordion-content' : '';

    //const accordionButton = this.state.isMobile ? '' : '';

    return (
      <div className="footer-inner">

        <div className="usa-grid">

          <ul className={className} id="footer-first-child">
            <li>
              <h4 className="va-footer-linkgroup-title">
                <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-programs" itemProp="name" aria-expanded="false">Veteran Programs and Services</button>
              </h4>
            </li>
            <li className={innerClassName} id="veteran-programs" aria-hidden="true">
              <ul>
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
                <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-resources" itemProp="name" aria-expanded="false">More VA Resources</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-resources" aria-hidden="true">
              <ul>
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
                <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-connect" itemProp="name" aria-expanded="false">Connect with Us</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-connect" aria-hidden="true">
              <ul>
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

          <ul className={className}>

            <li>
              <h4 className="va-footer-linkgroup-title">In Crisis? Get Help Now</h4>
            </li>
            <li>
              <a href="http://www.veteranscrisisline.net/">Veterans Crisis Line</a>
            </li>

            <li>
              <h4 className="va-footer-linkgroup-title">
                <button className="usa-button-unstyled usa-accordion-button" aria-controls="veteran-contact" itemProp="name" aria-expanded="false">Contact Us</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-contact" aria-hidden="true">
              <ul>
                <li><a href="#">Find a VA Location</a></li>
                <li><a href="#">Submit a Help Request</a></li>
                <li><a href="#">Go to VA Help Center</a></li>
                <li><a href="#">Call Us</a></li>
              </ul>
            </li>
          </ul>

        </div>

        <div className="usa-grid footer-banner">
          <a href="https://preview.va.gov" className="va-footer-logo" title="Go to VA.gov">
            <img src="/img/homepage/va-logo-white.png" />
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

export default connect (mapDispatchToProps)(Main);
