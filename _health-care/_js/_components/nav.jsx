import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
  render() {
    return (
      <dl className="tabs progess-menu">
        <dd className="tab-title" role="presentation">
          <Link to="/introduction">Introduction</Link><br/>
        </dd>
        <dd className="tab-title" role="presentation">
          <Link to="/personal-information">Personal Information</Link><br/>
        </dd>
        <dd className="tab-title" role="presentation">
          <Link to="/insurance-information">Insurance Information</Link><br/>
        </dd>
        <dd className="tab-title" role="presentation">
          <Link to="/military-service">Military Service</Link><br/>
        </dd>
        <dd className="tab-title" role="presentation">
          <Link to="/financial-assessment">Financial Assessment</Link><br/>
        </dd>
        <dd className="tab-title" role="presentation">
          <Link to="/review-and-submit">Review and Submit</Link><br/>
        </dd>
      </dl>
    );
  }
}

export default Nav;
