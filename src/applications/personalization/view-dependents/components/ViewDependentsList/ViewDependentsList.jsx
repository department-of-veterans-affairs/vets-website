import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import ViewDependentsListItem from '../ViewDependentsList/ViewDependentsListItem';

function ViewDependentsList(props) {
  let mainContent;

  if (props.loading) {
    mainContent = (
      <LoadingIndicator message="Loading your dependents" setFocus />
    );
  } else if (props.dependents && props.dependents.length > 0) {
    mainContent = props.dependents.map((dependent, index) => (
      <ViewDependentsListItem key={index} {...dependent} />
    ));
  } else {
    mainContent = <p>No dependents in this list.</p>;
  }

  return (
    <>
      <h2>{props.header}</h2>
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
};

export default ViewDependentsList;
