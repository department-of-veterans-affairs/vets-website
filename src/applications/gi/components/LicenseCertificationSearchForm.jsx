import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropdown from './Dropdown';
import { fetchLicenseCertificationResults } from '../actions';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const dropdownSchema = [
  {
    label: 'category',
    options: [
      { optionValue: 'License', optionLabel: 'License' },
      {
        optionValue: 'Certification',
        optionLabel: 'Certification',
      },
      {
        optionValue: 'Prep Course',
        optionLabel: 'Prep Course',
      },
    ],
    alt: 'category type',
    current: { optionValue: 'License', optionLabel: 'License' },
  },
  {
    label: 'state',
    options: [
      { optionValue: 'All', optionLabel: 'All' },
      { optionValue: 'State', optionLabel: 'State' },
    ],
    alt: 'state',
    current: { optionValue: 'All', optionLabel: 'All' },
  },
];

function LicenseCertificationSearchForm({
  dispatchFetchLicenseCertificationResults,
}) {
  const [dropdowns, setDropdowns] = useState(dropdownSchema);

  const handleSearch = () => {
    // console.log('update query parameters here');

    dispatchFetchLicenseCertificationResults();
  };
  const handleChange = e => {
    // identify the changed field
    const updatedFieldIndex = dropdowns.findIndex(dropdown => {
      return dropdown.label === e.target.id;
    });

    // identify the selected option
    const selectedOptionIndex = dropdowns[updatedFieldIndex].options.findIndex(
      option => option.optionValue === e.target.value,
    );

    setDropdowns(
      dropdowns.map(
        (dropdown, index) =>
          index === updatedFieldIndex
            ? {
                ...dropdown,
                current: dropdown.options[selectedOptionIndex],
              }
            : dropdown,
      ),
    );
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(dropdowns[0].label)}
        visible
        name={dropdowns[0].label}
        options={dropdowns[0].options}
        value={dropdowns[0].current.optionValue}
        onChange={handleChange}
        alt={dropdowns[0].alt}
        selectClassName="lc-dropdown-filter"
        required={dropdowns[0].label === 'category'}
      />
      <div>
        <va-text-input
          label={
            dropdowns[0].current.optionValue !== 'Prep Course'
              ? 'License/Certification Name'
              : 'Course Name'
          }
        />
      </div>

      {dropdowns[0].current.optionValue !== 'Prep Course' && (
        <Dropdown
          disabled={false}
          label={capitalizeFirstLetter(dropdowns[1].label)}
          visible
          name={dropdowns[1].label}
          options={dropdowns[1].options}
          value={dropdowns[1].current.optionValue}
          onChange={handleChange}
          alt={dropdowns[1].alt}
          selectClassName="lc-dropdown-filter"
          required={dropdowns[1].label === 'category'}
        />
      )}
      <div className="button-wrapper row vads-u-padding-y--6">
        <va-button text="Submit" onClick={handleSearch} />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  dispatchFetchLicenseCertificationResults: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  null,
  mapDispatchToProps,
)(LicenseCertificationSearchForm);
