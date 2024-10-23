import React, { useState } from 'react';
import LicenseCertificationSearchForm from '../../components/LicenseCertificationSearchForm';

// Should dropdownSchema be a piece of state in redux?
// Are these values likely to change often?
const dropdownSchema = [
  {
    label: 'category',
    options: [
      { optionValue: 'All', optionLabel: 'All' },
      { optionValue: 'License', optionLabel: 'License' },
      {
        optionValue: 'Certification',
        optionLabel: 'Certification',
      },
      {
        optionValue: 'Prep Exam',
        optionLabel: 'Prep Exam',
      },
    ],
    alt: 'category type',
    current: { optionValue: 'All', optionLabel: 'All' },
  },
  {
    label: 'country',
    options: [
      { optionValue: 'US', optionLabel: 'US' },
      { optionValue: 'Germany', optionLabel: 'Germany' },
      { optionValue: 'Japan', optionLabel: 'Japan' },
    ],
    alt: 'country',
    current: { optionValue: 'US', optionLabel: 'US' },
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

export default function LicenseCertificationSearch() {
  const [dropdowns, setDropdowns] = useState(dropdownSchema);

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
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications
          </h1>
          <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
            Licenses and certifications search page
          </p>
        </div>
        <div className="form-wrapper row">
          <LicenseCertificationSearchForm
            handleChange={handleChange}
            dropdowns={dropdowns}
          />
        </div>
      </section>
    </div>
  );
}
