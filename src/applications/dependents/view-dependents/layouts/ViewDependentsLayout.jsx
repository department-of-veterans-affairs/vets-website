import React from 'react';
import PropTypes from 'prop-types';

import ViewDependentsLists from './ViewDependentsLists';
import ViewDependentsSidebar from '../components/ViewDependentsSidebar/ViewDependentsSidebar';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeader';
import ViewDependentsSidebarBlock from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlock';
import {
  firstSidebarBlock,
  secondSidebarBlock,
  thirdSidebarBlock,
} from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlockStates/ViewDependentSidebarBlockStates';
import { isServerError, isClientError } from '../util';
import { errorFragment, infoFragment } from './helpers';

// All of this needs to use va_dependents_verification toggle

function ViewDependentsLayout(props) {
  let mainContent;

  if (props.loading) {
    // handle loading
    mainContent = (
      <va-loading-indicator message="Loading your information..." />
    );
  } else if (props.error && isServerError(props.error.code)) {
    // display error
    mainContent = <va-alert status="error">{errorFragment}</va-alert>;
  } else if (props.error && isClientError(props.error.code)) {
    // update displayed error to info status?
    mainContent = <va-alert status="info">{infoFragment}</va-alert>;
  } else if (
    props.onAwardDependents == null &&
    props.notOnAwardDependents == null
  ) {
    // display info
    mainContent = <va-alert status="info">{infoFragment}</va-alert>;
  } else {
    mainContent = (
      // main list
      <ViewDependentsLists
        manageDependentsToggle={props.manageDependentsToggle}
        loading={props.loading}
        onAwardDependents={props.onAwardDependents}
        notOnAwardDependents={props.notOnAwardDependents}
        dependencyVerificationToggle={props.dependencyVerificationToggle}
        vadvToggle={props.vadvToggle}
      />
    );
  }

  const layout = (
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <ViewDependentsHeader
          updateDiariesStatus={props.updateDiariesStatus}
          vadvToggle={props.vadvToggle}
        />
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
  );

  const vadvLayout = (
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        {/* Dynamic Header */}
        <ViewDependentsHeader
          updateDiariesStatus={props.updateDiariesStatus}
          vadvToggle={props.vadvToggle}
        />
        {/* Dependent cards ==> change CSS for these */}
        {mainContent}
      </div>
    </div>
  );

  return <div>{props.vadvToggle ? vadvLayout : layout}</div>;
}

ViewDependentsLayout.propTypes = {
  dependencyVerificationToggle: PropTypes.func,
  dependentsToggle: PropTypes.func,
  error: PropTypes.object,
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.func,
  notOnAwardDependents: PropTypes.array,
  updateDiariesStatus: PropTypes.func,
  vadvToggle: PropTypes.func,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLayout;
