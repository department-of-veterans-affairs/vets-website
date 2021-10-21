import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults } from '../../actions';

const SearchRepresentativeWidget = props => {
  const { loading, representatives, formData } = props;
  const customStyle = {
    maxWidth: 250,
  };
  useEffect(
    function() {
      props.fetchRepresentativeSearchResults();
      // hide the continue button since the buttons on the results act as continue buttons
      document.getElementById('2-continueButton').style.display = 'none';
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
              className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding--1p5 vads-u-margin-bottom--1"
            >
              <p className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold">
                {option.name}
              </p>
              <p className="vads-u-font-weight--bold">{option.type}</p>
              <p>{option.address}</p>
              <p>{option.city}</p>
              <p>{option.phone}</p>
              <div style={customStyle}>
                <button
                  onClick={() => handleClick(option.name)}
                  className="usa-button-primary"
                >
                  Choose this representative
                </button>
              </div>
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
