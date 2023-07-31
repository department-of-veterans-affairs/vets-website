import React, { /* useEffect, */ useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Formik } from 'formik';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';

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

  const { anySelectedOptions, options, values } = mapSponsorsToCheckboxOptions(
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

  return (
    <Formik initialValues={data} onSubmit={onSubmit}>
      <Form>
        <CheckboxGroup
          additionalFieldsetClass="vads-u-margin-top--0"
          additionalLegendClass="toe-sponsors_legend vads-u-margin-top--0"
          errorMessage={
            !anySelectedOptions &&
            (dirty || formContext?.submitted) &&
            errorMessage
          }
          label={
            // I'm getting conflicting linting issues here.
            // eslint-disable-next-line react/jsx-wrap-multilines
            <>
              <span className="toe-sponsors-labels_label--main">
                Which sponsor's benefits would you like to use?
              </span>
              <span className="toe-sponsors-labels_label--secondary">
                Select all sponsors whose benefits you would like to apply for
              </span>
            </>
          }
          onValueChange={onValueChange}
          options={options}
          required
          values={values}
        />
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
