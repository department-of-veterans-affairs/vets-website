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

/**
 * @typedef {Object} ViewDependentsListProps
 * @property {Array} dependents - list of dependents to display
 * @property {string} header - header text
 * @property {boolean} isAward - whether viewing award dependents
 * @property {string} link - link URL
 * @property {string} linkText - link text
 * @property {boolean} loading - whether data is loading
 * @property {boolean} manageDependentsToggle - whether manage dependents
 * feature is enabled
 * @property {object} subHeader - subheader content
 * @property {Array} submittedDependents - list of successfully submitted
 * dependents
 *
 * @param {ViewDependentsListProps} props - component props
 * @returns {JSX.Element} - ViewDependentsList component
 */
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
          ? 'You have no dependents on your VA benefits.'
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
      <va-link
        class="vads-u-display--block vads-u-margin-bottom--4"
        href={props.link}
        text={props.linkText}
      />
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
  isAward: PropTypes.bool,
  link: PropTypes.string,
  linkText: PropTypes.string,
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  subHeader: PropTypes.object,
  submittedDependents: PropTypes.array,
};
