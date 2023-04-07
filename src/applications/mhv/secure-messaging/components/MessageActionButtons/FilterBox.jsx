import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

const FilterBox = () => {
  const handleFormSubmit = () => {
    // console.log("handleSubmit")
  };
  const setFormError = () => {
    // console.log("setFormErro")
  };

  const formError = false;

  return (
    <form className="advanced-search-form" onSubmit={handleFormSubmit}>
      {formError && (
        <VaModal
          modalTitle="Invalid search"
          onPrimaryButtonClick={() => setFormError()}
          onCloseEvent={() => setFormError()}
          primaryButtonText="Ok"
          status="error"
          visible
        >
          <p>
            Please use at least one of the following search fields or choose a
            date range other than 'any'.
          </p>
          <ul>
            <li>Message ID</li>
            <li>From</li>
            <li>Subject</li>
            <li>Category</li>
          </ul>
        </VaModal>
      )}

      <va-accordion open-single>
        <va-accordion-item id="first">
          <h6 slot="headline">Add filters</h6>
        </va-accordion-item>
      </va-accordion>
    </form>
  );
};

FilterBox.propTypes = {};

export default FilterBox;
