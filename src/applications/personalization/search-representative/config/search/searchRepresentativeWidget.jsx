import React, { useState } from 'react';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

const locations = [
  {
    id: 12345,
    name: 'My place',
    city: 'Someplace',
    state: 'California',
  },
  {
    id: 4325,
    name: 'Another place',
    city: 'Another place',
    state: 'Arizona',
  },
];

const optionsList = locations.map(location => ({
  label: (
    <>
      <p className="vads-u-padding-left--4 vads-u-margin-top--neg3">
        {location.name}
      </p>
      <p className="vads-u-padding-left--4 vads-u-margin-top--neg2">{`${
        location.city
      } ${location.state}`}</p>
    </>
  ),
  value: `${location.name}|${location.id}`,
}));

const SearchRepresentativeWidget = props => {
  const { onChange } = props;
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <RadioButtons
        options={optionsList}
        label="Select your representative"
        required
        value={selected}
        onValueChange={value => {
          onChange(value.value);
          setSelected(value);
        }}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    state,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SearchRepresentativeWidget);
