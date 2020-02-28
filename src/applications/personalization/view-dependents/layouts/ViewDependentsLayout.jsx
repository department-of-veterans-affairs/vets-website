import React, { Component } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import ViewDependentsLists from './ViewDependentsLists';
import ViewDependentsSidebar from '../components/ViewDependentsSidebar/ViewDependentsSidebar';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeader';
import ViewDependentsSidebarBlock from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlock';
import {
  firstSidebarBlock,
  secondSidebarBlock,
  thirdSidebarBlock,
} from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlockStates/ViewDependentSidebarBlockStates';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { isServerError, isClientError } from '../util';
import { errorFragment, infoFragment, breadcrumbLinks } from './helpers';

class ViewDependentsLayout extends Component {
  render() {
    let mainContent;

    if (this.props.error && isServerError(this.props.error.code)) {
      mainContent = <AlertBox content={errorFragment} status="error" />;
    } else if (this.props.error && isClientError(this.props.error.code)) {
      mainContent = <AlertBox content={infoFragment} status="info" />;
    } else if (
      this.props.onAwardDependents == null &&
      this.props.notOnAwardDependents == null
    ) {
      mainContent = <AlertBox content={infoFragment} status="info" />;
    } else {
      mainContent = (
        <ViewDependentsLists
          loading={this.props.loading}
          onAwardDependents={this.props.onAwardDependents}
          notOnAwardDependents={this.props.notOnAwardDependents}
        />
      );
    }

    const layout = (
      <div className="vads-l-grid-container vads-u-padding--2">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <ViewDependentsHeader />
            {mainContent}
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--4">
            <ViewDependentsSidebar>
              <ViewDependentsSidebarBlock
                heading={firstSidebarBlock.heading}
                content={firstSidebarBlock.content}
              />
              <ViewDependentsSidebarBlock
                heading={secondSidebarBlock.heading}
                content={secondSidebarBlock.content}
              />
              <ViewDependentsSidebarBlock
                heading={thirdSidebarBlock.heading}
                content={thirdSidebarBlock.content}
              />
            </ViewDependentsSidebar>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
          <Breadcrumbs>{breadcrumbLinks}</Breadcrumbs>
        </div>
        {layout}
      </div>
    );
  }
}

export default ViewDependentsLayout;
