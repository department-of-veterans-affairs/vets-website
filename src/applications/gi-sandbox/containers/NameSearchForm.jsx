import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
} from '../actions';
import KeywordSearch from '../components/search/KeywordSearch';
import { updateUrlParams } from '../utils/helpers';
import { useHistory } from 'react-router-dom';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  filters,
  preview,
  search,
}) {
  const { version } = preview;
  const [name, setName] = useState(search.query.name);
  const history = useHistory();

  const updateUrlNameParams = paramName => {
    updateUrlParams(
      history,
      search.tab,
      { ...search.query, name: paramName },
      filters,
    );
  };

  const doSearch = value => {
    dispatchFetchSearchByNameResults(value, filters, version);
    updateUrlNameParams(value);
  };

  useEffect(
    () => {
      if (
        search.loadFromUrl &&
        search.query.name !== null &&
        search.query.name !== ''
      ) {
        doSearch(search.query.name);
      }
    },
    [search.loadFromUrl],
  );

  const handleSubmit = event => {
    event.preventDefault();
    doSearch(name);
  };

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchNameAutocompleteSuggestions(
      value,
      {
        category: filters.category,
      },
      version,
    );
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setName(value);
    dispatchUpdateAutocompleteName(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="vads-u-margin-y--0">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <KeywordSearch
              version={version}
              className="name-search"
              inputValue={name}
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => handleSubmit(e)}
              onSelection={s => setName(s.label)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              placeholder="school, employer, or training provider"
              suggestions={[...autocomplete.nameSuggestions]}
            />
          </div>
          <div className="medium-screen:vads-l-col--2 vads-u-text-align--right">
            <button type="submit" className="usa-button">
              Search
              <i aria-hidden="true" className="fa fa-search" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: state.filters,
  preview: state.preview,
  search: state.search,
});

const mapDispatchToProps = {
  dispatchFetchNameAutocompleteSuggestions: fetchNameAutocompleteSuggestions,
  dispatchUpdateAutocompleteName: updateAutocompleteName,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
