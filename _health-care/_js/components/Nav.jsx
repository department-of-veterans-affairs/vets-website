import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  render() {
    // TODO(akainic): DRY this up
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <dl className="tabs progess-menu">
        <dd className={`tab-title${this.props.currentUrl === '/' || this.props.currentUrl === '/introduction' ? ' active' : ''}`} role="presentation">
          <Link to="/introduction">Introduction</Link><br/>
        </dd>
        <dd className={`tab-title${this.props.currentUrl === '/personal-information' ? ' active' : ''}`} role="presentation">
          <Link to="/personal-information">Personal Information</Link><br/>
        </dd>
        <dd className={`tab-title${this.props.currentUrl === '/insurance-information' ? ' active' : ''}`} role="presentation">
          <Link to="/insurance-information">Insurance Information</Link><br/>
        </dd>
        <dd className={`tab-title${this.props.currentUrl === '/military-service' ? ' active' : ''}`} role="presentation">
          <Link to="/military-service">Military Service</Link><br/>
        </dd>
        <dd className={`tab-title${this.props.currentUrl === '/financial-asssessment' ? ' active' : ''}`} role="presentation">
          <Link to="/financial-assessment">Financial Assessment</Link><br/>
        </dd>
        <dd className={`tab-title${this.props.currentUrl === '/review-and-submit' ? ' active' : ''}`} role="presentation">
          <Link to="/review-and-submit">Review and Submit</Link><br/>
        </dd>
      </dl>
    );
  }
}

export default Nav;
