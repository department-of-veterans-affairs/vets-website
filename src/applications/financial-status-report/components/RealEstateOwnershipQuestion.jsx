import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const RealEstateOwnershipQuestion = props => {
  const { goToPath, goBack, onReviewPage } = props;
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const hasRealEstate = formData?.questions?.hasRealEstate;

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (hasRealEstate) {
        goToPath(`/enhanced-real-estate-asset-records`);
      } else {
        goToPath(`/vehicles`);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        dispatch(
          setData({
            ...formData,
            questions: {
              ...formData.questions,
              hasRealEstate: value === 'true',
            },
            realEstateValue: value === 'false' ? 0 : formData.realEstateValue,
          }),
        );
      }
    },
  };
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={handlers.onSubmit}>
      <div>
        <h3>Your real estate assets</h3>
      </div>
      <VaRadio
        class="vads-u-margin-y--2"
        label="Do you currently own any property?"
        hint="This includes properties with a mortage."
        onVaValueChange={handlers.onSelection}
        required
      >
        <va-radio-option
          id="has-property"
          label="Yes"
          value="true"
          checked={hasRealEstate}
        />
        <va-radio-option
          id="has-no-property"
          label="No"
          value="false"
          name="primary"
          checked={!hasRealEstate}
        />
      </VaRadio>
      <va-additional-info trigger="Why do I need to provide this information?">
        <p>
          We want to make sure we fully understand your financial situation. We
          ask for details about your real estate assets because it allows us to
          make a more informed decision on your request.
        </p>
        <br />
        <p>
          We won’t take collection action against real estate you own to resolve
          your debt.
        </p>
      </va-additional-info>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

RealEstateOwnershipQuestion.propTypes = {
  goToPath: PropTypes.func,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default RealEstateOwnershipQuestion;
