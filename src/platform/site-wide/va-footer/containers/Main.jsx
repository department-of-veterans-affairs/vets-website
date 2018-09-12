import React from 'react';
import { connect } from 'react-redux';
import { groupBy, orderBy } from 'lodash'
import links from '../../../static-data/footer-links.json'

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isMobile: false };
    this._linkObj = groupBy(links, "column")
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
  _generateLinkItems = (column, direction="desc") => (
    <ul className="va-footer-links">
      {orderBy(this._linkObj[column],"order", direction).map(link => 
        <li><a href={link.href} target={link.target}>{link.title}</a></li>
      )}
    </ul>
  )

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
              {this._generateLinkItems("1")}
            </li>
          </ul>

          <ul className={className} id="footer-services">

            <li>
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-resources" itemProp="name" aria-expanded="false">More VA Resources</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-resources" aria-hidden="true">
              {this._generateLinkItems("2")}
            </li>

          </ul>

          <ul className={className} id="footer-popular">
            <li>
              <h4 className="va-footer-linkgroup-title">
                <button disabled={buttonEnabled} className={buttonClasses} aria-controls="veteran-connect" itemProp="name" aria-expanded="false">Connect with Us</button>
              </h4>
            </li>

            <li className={innerClassName} id="veteran-connect" aria-hidden="true">
              {this._generateLinkItems("3")}
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
            {orderBy(this._linkObj["bottom_rail"],"order", 'desc').map(link => {
              return(<li><a href={link.href} target={link.target}>{link.title}</a> | </li>)
            })}
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
