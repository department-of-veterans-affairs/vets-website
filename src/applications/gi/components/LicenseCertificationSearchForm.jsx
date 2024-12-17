import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import {
  capitalizeFirstLetter,
  filterLcResults,
  handleUpdateLcFilterDropdowns,
  matchFilterIndex,
} from '../utils/helpers';
import LicenseCertificationKeywordSearch from './LicenseCertificationKeywordSearch';

const mappedStates = Object.entries(ADDRESS_DATA.states).map(state => {
  return { optionValue: state[0], optionLabel: state[1] };
});

export const updateDropdowns = (category = 'all', state = 'all') => {
  // console.log('updateDropdowns 🟢', { category, state });
  const initialDropdowns = [
    {
      label: 'category',
      options: [
        { optionValue: 'all', optionLabel: 'All' },
        { optionValue: 'license', optionLabel: 'License' },
        {
          optionValue: 'certification',
          optionLabel: 'Certification',
        },
        {
          optionValue: 'prep',
          optionLabel: 'Prep Course',
        },
      ],
      alt: 'category type',
      current: { optionValue: 'all', optionLabel: 'All' },
    },
    {
      label: 'state',
      options: [{ optionValue: 'all', optionLabel: 'All' }, ...mappedStates],
      alt: 'state',
      current: { optionValue: 'all', optionLabel: 'All' },
    },
  ];

  // console.log('newDropdowns', newDropdowns);
  return initialDropdowns.map(dropdown => {
    if (dropdown.label === 'category') {
      return {
        ...dropdown,
        current: dropdown.options.find(
          option => option.optionValue === category,
        ),
      };
    }

    if (dropdown.label === 'state') {
      // const stateMatch = dropdown.options.find(
      //   option => option.optionValue === state,
      // );
      // console.log('stateMatch', { stateMatch, state });
      return {
        ...dropdown,
        current: dropdown.options.find(option => option.optionValue === state),
      };
    }

    return dropdown;
  });
};

export default function LicenseCertificationSearchForm({
  suggestions,
  handleSearch,
  handleUpdateQueryParam,
  location,
  history,
}) {
  const [dropdowns, setDropdowns] = useState(updateDropdowns());
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [showStateAlert, setShowStateAlert] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const stateParam = searchParams.get('state') ?? 'all';

  useEffect(() => {
    setDropdowns(updateDropdowns(category, stateParam));
  }, []);

  useEffect(
    () => {
      if (dropdowns[0].current.optionValue === 'certification') {
        handleUpdateQueryParam()('state', 'all');
      }
    },
    [dropdowns],
  );

  useEffect(
    () => {
      setDropdowns(updateDropdowns(category, stateParam));
    },
    [stateParam],
  );

  useEffect(
    () => {
      const newSuggestions = filterLcResults(suggestions, name, {
        type: dropdowns[0].current.optionValue,
        state: dropdowns[1].current.optionValue,
      });

      if (name.trim() !== '') {
        newSuggestions.unshift({
          name,
          link: 'lce/',
          type: 'all',
        });
      }

      setFilteredSuggestions(newSuggestions);
    },
    [name, suggestions, dropdowns],
  );

  const handleReset = () => {
    history.replace('/lc-search');
    setDropdowns(updateDropdowns());
  };

  const handleChange = e => {
    const { updatedField, selectedOption } = matchFilterIndex(
      dropdowns,
      e.target,
    );

    handleUpdateQueryParam()(e.target.id, e.target.value);

    if (
      dropdowns[updatedField].options[selectedOption].optionValue ===
      'certification'
    ) {
      setDropdowns(updateDropdowns('certification', 'all'));
    }

    const newDropdowns = handleUpdateLcFilterDropdowns(
      dropdowns,
      updatedField,
      selectedOption,
    );

    setDropdowns(newDropdowns);
  };

  const onUpdateAutocompleteSearchTerm = value => {
    handleUpdateQueryParam()('name', value);
  };

  const onSelection = selection => {
    const { type, state } = selection;

    const _updateDropdowns = dropdowns.map(dropdown => {
      if (dropdown.label === 'state') {
        return {
          ...dropdown,
          current: dropdown.options.find(option => {
            return option.optionValue === state;
          }),
        };
      }

      return {
        ...dropdown,
        current: dropdown.options.find(option => {
          return option.optionValue === type;
        }),
      };
    });

    if (type === 'license' && dropdowns[1].current.optionValue !== state) {
      setShowStateAlert(true);
    }

    setDropdowns(_updateDropdowns);
  };

  const handleClearInput = () => {
    handleUpdateQueryParam()('name', '');
    setShowStateAlert(false);
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(dropdowns[0].label)}
        visible
        name={dropdowns[0].label}
        options={dropdowns[0].options}
        value={dropdowns[0].current.optionValue} // align here
        onChange={handleChange}
        alt={dropdowns[0].alt}
        selectClassName="lc-dropdown-filter"
        required={dropdowns[0].label === 'category'}
      />

      <Dropdown
        disabled={dropdowns[0].current.optionLabel === 'Certification'}
        label={`${capitalizeFirstLetter(dropdowns[1].label)}`}
        visible
        name={dropdowns[1].label}
        options={dropdowns[1].options}
        value={dropdowns[1].current.optionValue} // align here
        onChange={handleChange}
        alt={dropdowns[1].alt}
        selectClassName="lc-dropdown-filter"
        required={dropdowns[1].label === 'category'}
      >
        {showStateAlert && name.length > 0 ? (
          <va-alert
            className="license-alert"
            // slim={true}
            // disable-analytics={true}
            visible={dropdowns[0].current.optionLabel === 'License'}
            // close-btn-aria-label={closeBtnAriaLabel}
            closeable={false}
            fullWidth={false}
            style={{ maxWidth: '30rem' }}
          >
            The state of {dropdowns[1].current.optionLabel} has been selected
            becuase the {name} license is specific to it.
          </va-alert>
        ) : (
          <>
            (Note: Certifications are nationwide. Selecting a state from this
            dropdown will only impact licenses and prep courses)
          </>
        )}
      </Dropdown>
      <div>
        <LicenseCertificationKeywordSearch
          inputValue={name}
          suggestions={filteredSuggestions}
          onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
          onSelection={onSelection}
          handleClearInput={handleClearInput}
        />
      </div>

      <div className="button-wrapper row vads-u-padding-y--6 vads-u-padding-x--1">
        <va-button
          text="Submit"
          onClick={() => handleSearch(dropdowns[0].current.optionValue, name)}
        />
        <va-button
          text="Reset Search"
          className="usa-button-secondary reset-search"
          onClick={handleReset}
        />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
};
