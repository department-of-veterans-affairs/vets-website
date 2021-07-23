import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ViewDependentsListItem from '../ViewDependentsList/ViewDependentsListItem';

function ViewDependentsList(props) {
  let mainContent;
  const manageDependentsToggle = props?.manageDependentsToggle ?? null;
  if (props.loading) {
    mainContent = (
      <LoadingIndicator message="Loading your dependents" setFocus />
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
      {mainContent}
    </>
  );
}

ViewDependentsList.propTypes = {
  dependents: PropTypes.array,
  header: PropTypes.string,
  subHeader: PropTypes.object,
  manageDependentsToggle: PropTypes.bool,
};

export default ViewDependentsList;
