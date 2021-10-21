import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchRepresentativeSearchResults } from '../../actions';
import SearchRepresentativeResult from './searchRepresentativeResult';

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
            <SearchRepresentativeResult
              option={option}
              handleClick={handleClick}
              key={option.id}
            />
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
