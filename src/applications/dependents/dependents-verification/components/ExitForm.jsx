import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import { scrollAndFocus } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

export const form686Url = getAppUrl('686C-674');

export const ExitForm = ({ goBack }) => {
  useEffect(() => {
    scrollAndFocus('h1');
  }, []);

  const handlers = {
    goBack: () => {
      goBack();
    },
    goTo686: () => {
      window.location.assign(form686Url);
    },
  };

  return (
    <>
      <FormTitle
        title="Update your dependents in a different form"
        subTitle="VA Forms 21-686c and 21-674"
      />
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
    </>
  );
};

ExitForm.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
