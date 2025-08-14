import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setData } from 'platform/forms-system/src/js/actions';
import Form from '~/platform/forms/formulate-integration/Form';

import { getAppData } from '../selectors';

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

  const onValueChange = event => {
    const {
      target: { id, checked },
    } = event;
    const _sponsors = updateSponsorsOnValueChange(
      sponsors,
      firstSponsor,
      id,
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
        <VaCheckboxGroup
          label="Which sponsor's benefits would you like to use?"
          hint="Select all sponsors whose benefits you would like to apply for."
          onVaChange={onValueChange}
          required
          error={
            !anySelectedOptions && (dirty || formContext.submitted)
              ? errorMessage
              : ''
          }
        >
          {options.map(({ label, value, selected }) => (
            <va-checkbox
              id={value}
              key={label}
              label={label}
              checked={selected}
            />
          ))}
        </VaCheckboxGroup>
        <va-button
          uswds
          className="vads-u-margin-y--2"
          type="submit"
          text="Update page"
          onClick={updatePage}
        />
      </Form>
    </Formik>
  );
}

SponsorSelectionPage.propTypes = {
  data: PropTypes.object,
  errorMessage: PropTypes.string,
  firstSponsor: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  sponsors: PropTypes.object,
  updatePage: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  firstSponsor: state.form?.data?.firstSponsor,
  formData: state.form?.data || {},
  sponsors: state.form?.data?.sponsors,
  ...getAppData(state),
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
