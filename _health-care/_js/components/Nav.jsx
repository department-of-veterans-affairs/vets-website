import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  render() {
    // TODO(akainic): DRY this up
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ul className="usa-sidenav-list">
        <li role="presentation">
          <Link to="/introduction" activeClassName="usa-current">
            Introduction
          </Link>
        </li>
        <li role="presentation">
          Personal Information
          <ul className="usa-sidenav-sub_list">
            <li>
              <Link to="/personal-information/name-and-general-information" activeClassName="usa-current">
                Name and General Information
              </Link>
            </li>
            <li>
              <Link to="/personal-information/va-information" activeClassName="usa-current">
                VA-Specific Information
              </Link>
            </li>
            <li>
              <Link to="/personal-information/additional-information" activeClassName="usa-current">
                Additional Information
              </Link>
            </li>
            <li>
              <Link to="/personal-information/demographic-information" activeClassName="usa-current">
                Demographic Information
              </Link>
            </li>
            <li>
              <Link to="/personal-information/veteran-address" activeClassName="usa-current">
                Veteran Address
              </Link>
            </li>
          </ul>
        </li>
        <li role="presentation">
          Insurance Information
          <ul className="usa-sidenav-sub_list">
            <li>
              <Link to="/insurance-information/general" activeClassName="usa-current">
                General Insurance Information
              </Link>
            </li>
            <li>
              <Link to="/insurance-information/medicare-medicaid" activeClassName="usa-current">
                Medicare/Medicaid Information
              </Link>
            </li>
          </ul>
        </li>
        <li role="presentation">
          Military Service
          <ul className="usa-sidenav-sub_list">
            <li>
              <Link to="/military-service/service-information" activeClassName="usa-current">
                Service Information
              </Link>
            </li>
            <li>
              <Link to="/military-service/additional-information" activeClassName="usa-current">
                Additional Military Information
              </Link>
            </li>
          </ul>
        </li>
        <li role="presentation">
          Financial Assessment
          <ul className="usa-sidenav-sub_list">
            <li>
              <Link to="/financial-assessment/financial-disclosure" activeClassName="usa-current">
                Financial Disclosure
              </Link>
            </li>
            <li>
              <Link to="/financial-assessment/spouse-information" activeClassName="usa-current">
                Spouse Information
              </Link>
            </li>
            <li>
              <Link to="/financial-assessment/child-information" activeClassName="usa-current">
                Child Information
              </Link>
            </li>
            <li>
              <Link to="/financial-assessment/annual-income" activeClassName="usa-current">
                Annual Income
              </Link>
            </li>
            <li>
              <Link to="/financial-assessment/deductible-expenses" activeClassName="usa-current">
                Deductible Expenses
              </Link>
            </li>
          </ul>
        </li>
        <li role="presentation">
          <Link to="/review-and-submit" activeClassName="usa-current">
            Review and Submit
          </Link>
        </li>
      </ul>
    );
  }
}

export default Nav;
