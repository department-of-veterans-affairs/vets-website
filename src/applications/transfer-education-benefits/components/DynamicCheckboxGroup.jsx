import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CheckboxGroup from '@department-of-veterans-affairs/component-library/CheckboxGroup';
import { isArray, cloneDeep } from 'lodash';
import {
  fetchSponsors,
  updateSelectedSponsors,
  updateSponsors,
} from '../actions';
import {
  SPONSOR_NOT_LISTED_LABEL,
  SPONSOR_NOT_LISTED_VALUE,
} from '../constants';

function DynamicCheckboxGroup({
  dispatchSelectedSponsorsChange,
  dispatchSponsorsChange,
  errorMessage = 'Please select at least one sponsor',
  fetchedSponsors,
  fetchedSponsorsComplete,
  formContext,
  getSponsors,
  loadingMessage = 'Loading your sponsors...',
  selectedSponsors,
  sponsors,
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

    const _selectedSponsors = _sponsors.sponsors?.flatMap(
      sponsor => (sponsor.selected ? [sponsor.id] : []),
    );
    if (_sponsors.someoneNotListed) {
      _selectedSponsors.push(SPONSOR_NOT_LISTED_VALUE);
    }

    setDirty(true);
    dispatchSelectedSponsorsChange(_selectedSponsors);
    dispatchSponsorsChange(_sponsors);
  };

  const options =
    sponsors?.sponsors?.map(sponsor => ({
      label: sponsor.name,
      value: `sponsor-${sponsor.id}`,
    })) || [];
  options.push({
    label: SPONSOR_NOT_LISTED_LABEL,
    value: `sponsor-${SPONSOR_NOT_LISTED_VALUE}`,
  });

  return (
    <CheckboxGroup
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="toe-sponsors-checkboxes_legend vads-u-margin-top--0"
      errorMessage={
        !selectedSponsors?.length &&
        (dirty || formContext?.submitted) &&
        errorMessage
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
      values={Object.fromEntries(
        new Map(selectedSponsors?.map(id => [`sponsor-${id}`, true])),
      )}
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
  selectedSponsors: state.data?.selectedSponsors,
  sponsors: mapSponsors(state),
  state,
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  dispatchSelectedSponsorsChange: updateSelectedSponsors,
  dispatchSponsorsChange: updateSponsors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicCheckboxGroup);
