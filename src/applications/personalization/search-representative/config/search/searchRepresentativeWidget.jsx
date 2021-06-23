import React from 'react';
import { connect } from 'react-redux';
import { addRepresentative } from '../../actions/index';

const representatives = [
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

const SearchRepresentativeWidget = props => {
  function handleClick(name) {
    props.formData.preferredRepresentative = name;
  }
  return (
    <div>
      {representatives.map(option => {
        return (
          <div
            key={option.id}
            className="vads-u-background-color--gray-lighter vads-u-padding--1p5 vads-u-margin-bottom--1"
          >
            <p className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
              {option.name}
            </p>
            <p>{option.city}</p>

            <button
              onClick={() => handleClick(option.name)}
              className="usa-button-secondary"
            >
              Choose this representative
            </button>
          </div>
        );
      })}
    </div>
  );
};

const mapDispatchToProps = {
  addRepresentative,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRepresentativeWidget);
