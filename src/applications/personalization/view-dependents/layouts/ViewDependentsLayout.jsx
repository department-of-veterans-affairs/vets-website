import React, { Component } from 'react';

import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import ViewDependentsLists from './ViewDependentsLists';
import ViewDependentsSidebar from '../components/ViewDependentsSidebar/ViewDependentsSidebar';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeader';

class ViewDependentsLayout extends Component {
  render() {
    const breadcrumbLinks = [
      <a href="/" aria-label="back to VA Home page" key="1">
        Home
      </a>,
      <a
        href="/disability"
        aria-label="Back to the Disability Benefits page"
        key="2"
      >
        Disability Benefits
      </a>,
      <a
        href="/disability/add-remove-dependent"
        aria-label="Back to the Add or remove dependents page"
        key="3"
      >
        Add or remove dependents
      </a>,
      <a href="/disability/view-dependents/" key="4">
        Your Dependents
      </a>,
    ];

    const mainContent = (
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <ViewDependentsHeader />
            <ViewDependentsLists
              loading={this.props.loading}
              onAwardDependents={this.props.onAwardDependents}
              notOnAwardDependents={this.props.notOnAwardDependents}
            />
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--4">
            <ViewDependentsSidebar />
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
          <Breadcrumbs>{breadcrumbLinks}</Breadcrumbs>
        </div>
        {mainContent}
      </div>
    );
  }
}

export default ViewDependentsLayout;
