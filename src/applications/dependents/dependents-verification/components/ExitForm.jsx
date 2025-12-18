import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { deleteInProgressForm } from '../../shared/utils/api';

export const form686Url = getAppUrl('686C-674-v2'); // pass the entryName

/**
 * Exit Form Page Component
 * @typedef {object} ExitFormProps
 * @property {object} location - location object
 * @property {function} goBack - function to go back to the previous page
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {ExitFormProps} props - Component props
 * @returns {React.Component} - Exit form page
 */
export const ExitForm = ({
  goBack,
  contentBeforeButtons,
  contentAfterButtons,
  location = window.location,
}) => {
  useEffect(() => {
    scrollAndFocus('h1.page-title');
  }, []);

  const handlers = {
    goBack: () => {
      goBack();
    },
    goTo686: async () => {
      await deleteInProgressForm(VA_FORM_IDS.FORM_21_0538);
      location.assign(form686Url);
    },
  };

  return (
    <>
      <div className="schemaform-title internal-page-title">
        <h1 className="page-title">
          Update your dependents in a different form
        </h1>
        <div className="schemaform-subtitle">VA Forms 21-686c and 21-674</div>
      </div>
      <p>
        Because you told us you need to update your dependents, we need you to
        use a different online form. This form will help you add or remove
        dependents.
      </p>
      <p>
        We encourage you to make these updates now so we pay you the right
        benefit amount. If your dependents’ information isn’t correct, this
        could lead to a benefit overpayment. Then, you’d have to repay the extra
        money.
      </p>
      <p>
        After you get your decision letter for the dependents you updated, come
        back here to verify all your dependents.
      </p>
      {contentBeforeButtons}
      <div className="vads-u-margin-y--2 vads-u-display--flex">
        <va-button
          back
          class="vads-u-margin-right--1"
          onClick={handlers.goBack}
        />
        <va-button
          continue
          class="exit-form"
          onClick={handlers.goTo686}
          text="Go to add or remove dependents form"
        />
      </div>
      {contentAfterButtons}
      <div className="vads-u-margin-bottom--4" />
    </>
  );
};

ExitForm.propTypes = {
  contentAfterButtons: PropTypes.node.isRequired,
  contentBeforeButtons: PropTypes.node.isRequired,
  goBack: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    assign: PropTypes.func,
  }),
};
