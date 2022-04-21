import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isArray, cloneDeep } from 'lodash';
import { Formik } from 'formik';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import Form from '~/platform/forms/formulate-integration/Form';

import { fetchSponsors, updateSponsors } from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';
import SponsorsSelectionHeadings from '../components/SponsorsSelectionHeadings';
import { Sponsors } from '../components/Sponsors';
// import SaveFormLink from '../../../../platform/forms/save-in-progress/SaveFormLink';

function SponsorSelectionPage({
  data,
  dispatchSponsorsChange,
  errorMessage = 'Please select at least one sponsor',
  fetchedSponsors,
  fetchedSponsorsComplete,
  formContext,
  getSponsors,
  goBack,
  goForward,
  loadingMessage = 'Loading your sponsors...',
  onReviewPage,
  sponsors,
  updatePage,
}) {
  const [dirty, setDirty] = useState(false);

  useEffect(
    () => {
      if (!sponsors?.sponsors && !fetchedSponsors) {
        getSponsors();
      }
    },
    [getSponsors, sponsors],
  );

  if (!fetchedSponsorsComplete) {
    return <va-loading-indicator message={loadingMessage} />;
  }
  if (!sponsors?.sponsors.length) {
    return <></>;
  }

  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: `Sponsor ${index + 1}: ${sponsor.name}`,
      selected: sponsor.selected,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    selected: sponsors?.someoneNotListed,
    value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
  });
  const selectedOptions = !!options?.filter(o => o.selected)?.length;

  const onValueChange = ({ value }, checked) => {
    const _sponsors = cloneDeep(sponsors);

    if (value === `sponsor-${SPONSOR_NOT_LISTED_VALUE}`) {
      _sponsors.someoneNotListed = checked;
    } else {
      const sponsorIndex = _sponsors.sponsors.findIndex(
        sponsor => `sponsor-${sponsor.id}` === value,
      );
      if (sponsorIndex > -1) {
        _sponsors.sponsors[sponsorIndex].selected = checked;
      }
    }

    // Check to make sure that a previously-selected first sponsor hasn't
    // been removed from the list of selected sponsors.
    if (
      !checked &&
      (value === `sponsor-${sponsors?.firstSponsor}` ||
        _sponsors.sponsors?.filter(s => s.selected)?.length < 2)
    ) {
      _sponsors.firstSponsor = null;
    }

    setDirty(true);
    dispatchSponsorsChange(_sponsors);
  };

  const onSubmit = (formData, formsSystem) => {
    if (!selectedOptions) {
      setDirty(true);
      return false;
    }
    return onReviewPage
      ? updatePage(formData, formsSystem)
      : goForward(formData, formsSystem);
  };

  const values = Object.fromEntries(
    new Map(options?.map(option => [option.value, !!option.selected])),
  );

  const saveAndNavButtons = (
    <>
      {/* <SaveFormLink
        locationPathname={this.props.location.pathname}
        form={form}
        formConfig={formConfig}
        route={route}
        pageList={route.pageList}
        user={user}
        showLoginModal={this.props.showLoginModal}
        saveAndRedirectToReturnUrl={this.props.saveAndRedirectToReturnUrl}
        toggleLoginModal={this.props.toggleLoginModal}
      /> */}
      <FormNavButtons goBack={goBack} submitToContinue />
    </>
  );
  const updateButton = <button type="submit">Update page</button>;

  return (
    <Formik initialValues={data} onSubmit={onSubmit}>
      <Form>
        <SponsorsSelectionHeadings />
        <Sponsors />
        <CheckboxGroup
          additionalFieldsetClass="vads-u-margin-top--0"
          additionalLegendClass="toe-sponsors_legend vads-u-margin-top--0"
          errorMessage={
            !selectedOptions &&
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
        {onReviewPage ? updateButton : saveAndNavButtons}
      </Form>
    </Formik>
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data.sponsors?.sponsors)) {
    return state.form.data.sponsors;
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return {
      sponsors: state.data.sponsors,
    };
  }

  return {};
};

const mapStateToProps = state => ({
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  sponsors: mapSponsors(state),
  state,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchSponsorsChange: updateSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SponsorSelectionPage);
