import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  render() {
    // TODO(akainic): DRY this up
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ul className="usa-sidenav-list">
        <li role="presentation">
          <Link to="/introduction"
              className={this.props.currentUrl === '/' || this.props.currentUrl === '/introduction' ? ' usa-current' : ''}>
            Introduction
          </Link>
        </li>
        <li role="presentation">
          <Link to="/personal-information"
              className={this.props.currentUrl === '/personal-information' ? ' usa-current' : ''}>
            Personal Information
          </Link>
          <ul className="usa-sidenav-sub_list">
            <li>Name and General Information</li>
            <li>VA-Specific Information</li>
            <li>Additional Information</li>
            <li>Demographic Information</li>
            <li>Veteran Address</li>
          </ul>
        </li>
        <li role="presentation">
          <Link to="/insurance-information"
              className={this.props.currentUrl === '/insurance-information' ? ' usa-current' : ''}>
            Insurance Information
          </Link>
          <ul className={`usa-sidenav-sub_list${this.props.currentUrl === '/insurance-information' ? ' active' : ''}`}>
            <li>General Insurance Information</li>
            <li>Medicare/Medicaid Information</li>
          </ul>
        </li>
        <li role="presentation">
          <Link to="/military-service"
              className={this.props.currentUrl === '/military-service' ? ' usa-current' : ''}>
            Military Service
          </Link>
          <ul className="usa-sidenav-sub_list">
            <li>Service Information</li>
            <li>Additional Military Information</li>
          </ul>
        </li>
        <li role="presentation">
          <Link to="/financial-assessment"
              className={this.props.currentUrl === '/financial-assessment' ? ' usa-current' : ''}>
            Financial Assessment
          </Link>
          <ul className="usa-sidenav-sub_list">
            <li>Financial Disclosure</li>
            <li>Spouse Information</li>
            <li>Child Information</li>
            <li>Annual Income</li>
            <li>Deductible Expenses</li>
          </ul>
        </li>
        <li role="presentation">
          <Link to="/review-and-submit"
              className={this.props.currentUrl === '/review-and-submit' ? ' usa-current' : ''}>
            Review and Submit
          </Link>
        </li>
      </ul>
    );
  }
}

export default Nav;
