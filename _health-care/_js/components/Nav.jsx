import React from 'react';

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 */
class Nav extends React.Component {
  render() {
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ol className="process">
        <li className="step one wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/introduction') ? ' section-current' : ''}>Introduction</h5>
          </div>
        </li>
        <li role="presentation" className="step two wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/personal-information') ? ' section-current' : ''}>Personal Information</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/personal-information/name-and-general-information' ? ' section-current' : ''}>
                  Name and General Information
              </li>
              <li className={this.props.currentUrl === '/personal-information/va-information' ? ' section-current' : ''}>
                  VA-Specific Information
              </li>
              <li className={this.props.currentUrl === '/personal-information/additional-information' ? ' section-current' : ''}>
                  Additional Information
              </li>
              <li className={this.props.currentUrl === '/personal-information/demographic-information' ? ' section-current' : ''}>
                  Demographic Information
              </li>
              <li className={this.props.currentUrl === '/personal-information/veteran-address' ? ' section-current' : ''}>
                  Veteran Address
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className="step three wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/insurance-information') ? ' section-current' : ''}>Insurance Information</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/insurance-information/general' ? ' section-current' : ''}>
                  General Insurance Information
              </li>
              <li className={this.props.currentUrl === '/insurance-information/medicare-medicaid' ? ' section-current' : ''}>
                  Medicare/Medicaid Information
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className="step four wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/military-service') ? ' section-current' : ''}>Military Service</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/military-service/service-information' ? ' section-current' : ''}>
                  Service Information
              </li>
              <li className={this.props.currentUrl === '/military-service/additional-information' ? ' section-current' : ''}>
                  Additional Military Information
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className="step five wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/financial-assessment') ? ' section-current' : ''}>Financial Assessment</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/financial-assessment/financial-disclosure' ? ' section-current' : ''}>
                Financial Disclosure
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/spouse-information' ? ' section-current' : ''}>
                  Spouse Information
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/child-information' ? ' section-current' : ''}>
                  Child Information
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/annual-income' ? ' section-current' : ''}>
                  Annual Income
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/deductible-expenses' ? ' section-current' : ''}>
                  Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className="step six wow fadeIn animated">
          <div>
            <h5 className={this.props.currentUrl.startsWith('/review-and-submit') ? ' section-current' : ''}>Review and Submit</h5>
          </div>
        </li>
      </ol>
    );
  }
}

Nav.propTypes = {
  currentUrl: React.PropTypes.string.isRequired
};

export default Nav;
