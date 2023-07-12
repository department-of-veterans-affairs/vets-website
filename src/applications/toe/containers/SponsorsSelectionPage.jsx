import React, { /* useEffect, */ useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Formik } from 'formik';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setData } from 'platform/forms-system/src/js/actions';
import Form from '~/platform/forms/formulate-integration/Form';

import {
  mapFormSponsors,
  mapSponsorsToCheckboxOptions,
  updateSponsorsOnValueChange,
} from '../helpers';

function SponsorSelectionPage({
  data,
  errorMessage = 'Please select at least one sponsor',
  firstSponsor,
  formContext,
  formData,
  setFormData,
  sponsors,
  updatePage,
}) {
  const [dirty, setDirty] = useState(false);

  if (!sponsors?.sponsors.length) {
    return <></>;
  }

  const { anySelectedOptions, options } = mapSponsorsToCheckboxOptions(
    sponsors,
  );

  const onValueChange = ({ value }, checked) => {
    const _sponsors = updateSponsorsOnValueChange(
      sponsors,
      firstSponsor,
      value,
      checked,
    );

    setDirty(true);
    setFormData(mapFormSponsors(formData, _sponsors));
  };

  const onSubmit = (_formData, formsSystem) => {
    if (!anySelectedOptions) {
      setDirty(true);
      return false;
    }
    return updatePage(_formData, formsSystem);
  };

  const errorMsg =
    !anySelectedOptions && (dirty || formContext?.submitted)
      ? errorMessage
      : '';

  return (
    <Formik initialValues={data} onSubmit={onSubmit}>
      <Form>
        <VaCheckboxGroup
          label="Which sponsor's benefits would you like to use?"
          hint="Select all sponsors whose benefits you would like to apply for."
          onValueChange={onValueChange}
          required
          error={errorMsg}
        >
          {options.map(({ label, selected }) => (
            <va-checkbox key={label} label={label} checked={selected} />
          ))}
        </VaCheckboxGroup>
        <button className="vads-u-margin-y--2" type="submit">
          Update page
        </button>
      </Form>
    </Formik>
  );
}

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  sponsors: state.form?.data?.sponsors,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SponsorSelectionPage),
);
