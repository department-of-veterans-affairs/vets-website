import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
// import { TextField } from '@department-of-veterans-affairs/formulate';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { VaRadioOption } from '@department-of-veterans-affairs/web-components/react-bindings';
import { connect } from 'react-redux';

const DisabilityRating = ({
  // title,
  data,
  // onReviewPage,
  goBack,
  goForward,
  // updatePage,
  setFormData, // setData
}) => {
  // Set state for this form
  const [disabilityObj, setDisabilityObj] = useState({
    value: data.disabilityRating || false,
    dirty: false,
  });

  const updateFormData = () => {
    // Do some kind of validation before setting form data

    // use setData to set form schema data
    setFormData({ ...data, disabilityRating: disabilityObj.value });

    // Redirect to page using goToPath, or if on review page,
    // return to review mode instead of edit mode.
    // onReviewPage ? updatePage() : goToPath(returnPath);

    goForward();
  };
  const onChangeYes = () => {
    setDisabilityObj({ value: true, dirty: true });
  };

  const onChangeNo = () => {
    setDisabilityObj({ value: false, dirty: true });
  };

  const navButtons = (
    <FormNavButtons goBack={goBack} goForward={goForward} submitToContinue />
  );
  // const updateButton = <button type="submit">Review update button</button>;
  return (
    <form onSubmit={updateFormData}>
      <fieldset>
        <p>Have you applied for and received a disability rating from VA?</p>
        <p>
          We’re asking because receivimg a service-connected disability rating
          from VA may make you eligible for additional benefits. Receiving these
          benefits won’t take away from other Veterans in need.
        </p>
        <a href="https://www.va.gov/disability/eligibility">
          Learn more about disability ratings.
        </a>
        <VaRadioOption
          uswds
          label="Yes"
          name="v3RadioOptYes"
          value="Yes"
          checked={disabilityObj.value}
          onChange={onChangeYes}
        />
        <VaRadioOption
          uswds
          label="No"
          name="v3RadioOptNo"
          value="No"
          checked={disabilityObj.value}
          onChange={onChangeNo}
        />
        {navButtons}
      </fieldset>
    </form>
  );
};

DisabilityRating.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    disabilityRating: PropTypes.bool,
  }),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  updatePage: PropTypes.func,
  setFormData: PropTypes.func,
};

// map setData to component props
const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(DisabilityRating);
