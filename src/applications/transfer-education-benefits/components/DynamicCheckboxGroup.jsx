import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import environment from 'platform/utilities/environment';
// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
// import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
// import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';
import { isArray, cloneDeep } from 'lodash';
import { fetchSponsors, updateSelectedSponsors } from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

// import { apiRequest } from 'platform/utilities/api';

// const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

function DynamicCheckboxGroup({
  dispatchSelectedSponsorsChange,
  errorMessage = 'Please select at least one sponsor',
  getSponsors,
  sponsors,
  form,
}) {
  const [dirty, setDirty] = useState(false);

  useEffect(
    () => {
      if (!sponsors?.sponsors) {
        getSponsors();
      }
    },
    [getSponsors, sponsors],
  );

  if (!sponsors.sponsors || !sponsors.sponsors.length) {
    return <h1>Alert: you don't have any sponsors</h1>;
  }

  const options =
    sponsors?.sponsors?.map((sponsor, index) => ({
      label: sponsor.name,
      value: index,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    value: SPONSOR_NOT_LISTED_VALUE,
  });

  const onValueChange = ({ value }, checked) => {
    const _sponsors = cloneDeep(sponsors);

    if (value === SPONSOR_NOT_LISTED_VALUE) {
      _sponsors.someoneNotListed = checked;
    }

    const sponsorIndex = Number.parseInt(value, 10);
    if (
      !Number.isNaN(sponsorIndex) &&
      sponsorIndex < sponsors?.sponsors?.length
    ) {
      _sponsors.sponsors[sponsorIndex].selected = checked;
    }

    setDirty(true);
    dispatchSelectedSponsorsChange(_sponsors);
  };

  // if (loading) {
  //   return <va-loading-indicator message="Loading your sponsors..." />;
  // }

  let valid;
  try {
    valid = form?.pages?.sponsorInformation?.uiSchema['view:sponsors'][
      'ui:validations'
    ][0].validator(null, form.data['view:sponsors']);
  } catch (e) {
    valid = true;
  }

  return (
    <CheckboxGroup
      additionalLegendClass="toe-sponsors-checkboxes_legend"
      errorMessage={!valid && dirty && errorMessage}
      label={
        <>
          <span className="toe-sponsors-checkboxes_legend--main">
            Which sponsor's benefits would you like to use?
          </span>
          <span className="toe-sponsors-checkboxes_legend--secondary">
            Select all sponsors whose benefits you would like to apply for
          </span>
        </>
      }
      onValueChange={onValueChange}
      options={options}
      required
      values={
        new Map(
          sponsors?.sponsors?.map(sponsor => [sponsor.value, sponsor.selected]),
        )
      }
    />
  );
}

const mapSponsors = state => {
  if (isArray(state.form.data['view:sponsors']?.sponsors)) {
    return state.form.data['view:sponsors'];
  }

  if (isArray(state.data?.sponsors?.sponsors)) {
    return {
      sponsors: state.data.sponsors,
    };
  }

  return {};
};

const mapStateToProps = state => ({
  sponsors: mapSponsors(state),
  form: state.form,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchSelectedSponsorsChange: updateSelectedSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicCheckboxGroup);
