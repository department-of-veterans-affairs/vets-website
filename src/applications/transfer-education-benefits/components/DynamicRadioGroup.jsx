import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
// import environment from 'platform/utilities/environment';
// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
// import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
// import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { isArray } from 'lodash';
import { fetchSponsors, updateSelectedSponsors } from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

// import { apiRequest } from 'platform/utilities/api';

// const apiUrl = `${environment.API_URL}/covid_vaccine/v0/facilities/`;

function DynamicRadioGroup({
  dispatchSelectedSponsorsChange,
  errorMessage = 'Please select at least one sponsor',
  fetchedSponsors,
  fetchedSponsorsComplete,
  getSponsors,
  loadingMessage = 'Loading your sponsors...',
  sponsors,
  form,
}) {
  const [dirty, setDirty] = useState(false);
  const renderCounter = useRef(0);
  renderCounter.current += 1;

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

  const onValueChange = ({ value } /* , checked */) => {
    const sponsorIndex = Number.parseInt(value, 10);
    const _sponsors = {
      ...sponsors,
      someoneNotListedFirstSponsor: value === SPONSOR_NOT_LISTED_VALUE,
      sponsors: sponsors.sponsors.map((sponsor, index) => ({
        ...sponsor,
        firstSponsor: sponsorIndex === index,
      })),
    };
    setDirty(true);
    dispatchSelectedSponsorsChange(_sponsors);
  };

  const options = sponsors?.sponsors?.flatMap(
    (sponsor, index) =>
      sponsor.selected
        ? [
            {
              label: sponsor.name,
              value: `${index} `,
              firstSponsor: sponsor.firstSponsor,
            },
          ]
        : [],
  );
  if (sponsors.someoneNotListed) {
    options.push({
      label: SPONSOR_NOT_LISTED_LABEL,
      value: SPONSOR_NOT_LISTED_VALUE,
    });
  }
  const selectedOption = {
    value: sponsors?.someoneNotListedFirstSponsor
      ? SPONSOR_NOT_LISTED_VALUE
      : options?.find(option => option.firstSponsor)?.value,
  };

  let valid;
  try {
    valid = form?.pages?.sponsorInformation?.uiSchema['view:sponsors'][
      'ui:validations'
    ][0](null, form.data['view:sponsors']);
  } catch (e) {
    valid = true;
  }

  return (
    <RadioButtons
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="toe-sponsors-checkboxes_legend vads-u-margin-top--0"
      errorMessage={
        !valid && (dirty || renderCounter.current > 1) && errorMessage
      }
      label={
        // I'm getting conflicting linting issues here.
        // eslint-disable-next-line react/jsx-wrap-multilines
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
      values={selectedOption}
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
  fetchedSponsors: state.data?.fetchedSponsors,
  fetchedSponsorsComplete: state.data?.fetchedSponsorsComplete,
  form: state.form,
  sponsors: mapSponsors(state),
  state,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchSelectedSponsorsChange: updateSelectedSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicRadioGroup);
