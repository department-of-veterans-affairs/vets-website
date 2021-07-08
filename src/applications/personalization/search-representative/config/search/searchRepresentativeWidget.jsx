import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults } from '../../actions';

const SearchRepresentativeWidget = props => {
  const { loading, representatives, formData } = props;
  useEffect(
    function() {
      props.fetchRepresentativeSearchResults();
    },
    [loading],
  );
  function handleClick(value) {
    const updatedFormData = {
      ...formData,
      preferredRepresentative: value,
    };
    props.setData(updatedFormData);
  }

  if (loading) {
    return <div>Loading...</div>;
  } else if (representatives.length > 0) {
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
  } else {
    return <div>No results</div>;
  }
};

const mapDispatchToProps = {
  setData,
  fetchRepresentativeSearchResults,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
    representatives: state.allSearchResults.representativeSearchResults,
    loading: state.allSearchResults.loading,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRepresentativeWidget);
