import React from 'react';

import propTypes from './types';

const parentOther = {
  handlers: {
    goForward: () => 'DONE',

    onSubmit: ({ goForward }) => {
      goForward();
    },
  },

  /** @type {PicklistComponentProps} */
  Component: ({ firstName, isEditing }) => (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        {`${isEditing ? 'Edit changes' : 'Changes'} to ${firstName}`}
      </h3>

      <p>
        Since you can only remove a parent if they have died,{' '}
        <strong>
          we will not apply any changes to {firstName} and will remain on your
          benefits.
        </strong>
      </p>

      <va-additional-info trigger="Why can I only remove a parent dependent if they have died?">
        <p>
          The only removal option for a parent allowed in this form is due to
          death. If your parent is still living and you need to make changes to
          your benefits, call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ).
        </p>
      </va-additional-info>

      {/* <CancelButton
        dependentType={itemData.relationshipToVeteran?.toLowerCase()}
        removePath="options-selection/remove-active-dependents"
      /> */}
    </>
  ),
};

parentOther.propTypes = propTypes.Page;
parentOther.Component.propTypes = propTypes.Component;

export default parentOther;
