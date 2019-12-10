import React, { Component } from 'react';

import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import ViewDependentsList from './ViewDependentsList/ViewDependentsList';
import ViewDependentsSidebar from './ViewDependentsSidebar/ViewDependentsSidebar';
import ViewDependentsHeader from './ViewDependentsHeader/ViewDependentsHeader';

class ViewDependentsLayout extends Component {
  render() {
    return (
      <div>
        <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
          <Breadcrumbs>
            {[
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
            ]}
          </Breadcrumbs>
        </div>
        <div className="vads-l-grid-container">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <ViewDependentsHeader />
              <ViewDependentsList />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <ViewDependentsSidebar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewDependentsLayout;
