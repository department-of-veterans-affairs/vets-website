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

function ViewDependentsLayout(props) {
  let mainContent;

  if (props.loading) {
    mainContent = (
      <va-loading-indicator message="Loading your information..." />
    );
  } else if (props.error && isServerError(props.error.code)) {
    mainContent = <va-alert status="error">{errorFragment}</va-alert>;
  } else if (props.error && isClientError(props.error.code)) {
    mainContent = <va-alert status="info">{infoFragment}</va-alert>;
  } else if (
    props.onAwardDependents == null &&
    props.notOnAwardDependents == null
  ) {
    mainContent = <va-alert status="info">{infoFragment}</va-alert>;
  } else {
    mainContent = (
      <ViewDependentsLists
        manageDependentsToggle={props.manageDependentsToggle}
        loading={props.loading}
        onAwardDependents={props.onAwardDependents}
        notOnAwardDependents={props.notOnAwardDependents}
        dependencyVerificationToggle={props.dependencyVerificationToggle}
      />
    );
  }

  const layout = (
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <ViewDependentsHeader updateDiariesStatus={props.updateDiariesStatus} />
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

  return <div>{layout}</div>;
}

ViewDependentsLayout.propTypes = {
  error: PropTypes.object,
  notOnAwardDependents: PropTypes.array,
  onAwardDependents: PropTypes.array,
  loading: PropTypes.bool,
  dependentsToggle: PropTypes.func,
  dependencyVerificationToggle: PropTypes.func,
  manageDependentsToggle: PropTypes.func,
  updateDiariesStatus: PropTypes.func,
};

export default ViewDependentsLayout;
