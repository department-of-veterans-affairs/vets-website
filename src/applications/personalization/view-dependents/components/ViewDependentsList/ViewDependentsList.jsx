import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ViewDependentsListItem from './ViewDependentsListItem';

const RemoveDependentSuccessMessage = () => (
  <p
    aria-live="polite"
    className="vads-u-background-color--green-lightest vads-u-padding--2"
  >
    We’ll update your information for this dependent. If we need you to give us
    more information or documents, we’ll contact you by mail.
  </p>
);
function ViewDependentsList(props) {
  let mainContent;
  const manageDependentsToggle = props?.manageDependentsToggle ?? null;
  if (props.loading) {
    mainContent = (
      <va-loading-indicator message="Loading your dependents" set-focus />
    );
  } else if (props.dependents && props.dependents.length > 0) {
    mainContent = props.dependents.map((dependent, index) => (
      <ViewDependentsListItem
        key={index}
        stateKey={index}
        manageDependentsToggle={manageDependentsToggle}
        {...dependent}
      />
    ));
  } else {
    mainContent = (
      <p className="vads-u-background-color--gray-lightest vads-u-padding--2p5">
        {props?.isAward
          ? `There are no dependents associated with your VA benefits`
          : `We have no record of dependents who are not on your VA benefits.`}
      </p>
    );
  }

  return (
    <>
      <h2 className={props.isAward ? 'vads-u-margin-top--1p5' : null}>
        {props.header}
      </h2>
      <p>{props.subHeader}</p>
      <a
        className="vads-u-display--block vads-u-margin-bottom--4"
        href={props.link}
      >
        {props.linkText}
      </a>
      {manageDependentsToggle && props?.submittedDependents?.length > 0 && (
        <RemoveDependentSuccessMessage />
      )}
      {mainContent}
    </>
  );
}

const mapStateToProps = state => ({
  submittedDependents: state?.removeDependents?.submittedDependents,
});

export default connect(mapStateToProps, null)(ViewDependentsList);

export { ViewDependentsList };
ViewDependentsList.propTypes = {
  dependents: PropTypes.array,
  header: PropTypes.string,
  manageDependentsToggle: PropTypes.bool,
  subHeader: PropTypes.object,
  submittedDependents: PropTypes.array,
};
