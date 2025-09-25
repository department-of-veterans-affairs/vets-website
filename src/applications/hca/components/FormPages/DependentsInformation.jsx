import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { LAST_YEAR } from '../../utils/helpers';

const DependentsInformation = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  return (
    <>
      <h3>Your dependents</h3>
      <p>In the next few questions, we’ll ask you about your dependents.</p>

      <p>
        <strong>Here’s who we consider to be a dependent:</strong>
      </p>
      <ul>
        <li>A spouse (we recognize same-sex and common law marriages)</li>
        <li>An unmarried child (including adopted children or stepchildren)</li>
      </ul>
      <p>
        <strong>
          If your dependent is an unmarried child, one of these descriptions
          must be true:
        </strong>
      </p>
      <ul>
        <li>
          They’re under 18 years old, <strong>or</strong>
        </li>
        <li>
          They’re between the ages of 18 and 23 years old and were enrolled as a
          full-time or part-time student in high school, college, or vocational
          school in {LAST_YEAR}, <strong>or</strong>
        </li>
        <li>
          They’re living with a permanent disability that happened before they
          turned 18 years old
        </li>
      </ul>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

DependentsInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default DependentsInformation;
