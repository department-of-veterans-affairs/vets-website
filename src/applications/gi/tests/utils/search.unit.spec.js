import { expect } from 'chai';
import { searchWithFilters } from '../../utils/search';

const defaultProps = {
  search: {
    inProgress: false,
  },
  location: {
    query: {
      name: '',
    },
  },
  clearAutocompleteSuggestions: () => {},
};

describe('Search helpers:', () => {
  describe('searchWithFilters', () => {
    describe('does not query to router', () => {
      it('when search in progress', () => {
        const props = {
          ...defaultProps,
          search: { inProgress: true },
          router: [],
        };
        searchWithFilters(props);
        expect(props.router).to.be.empty;
      });

      it('when query is not changed', () => {
        const props = {
          ...defaultProps,
          router: [],
        };
        searchWithFilters(props);
        expect(props.router).to.be.empty;
      });
    });

    describe('sends query to router', () => {
      it('adds params to query', () => {
        const props = {
          ...defaultProps,
          router: [],
        };
        const params = [{ field: 'field', value: 'value' }];
        searchWithFilters(props, params);

        expect(props.router[0].query.field).to.equal('value');
      });

      it('removes params from query when value is false', () => {
        const props = {
          ...defaultProps,
          router: [],
        };
        const params = [
          { field: 'field', value: 'value' },
          { field: 'empty', value: false },
        ];
        searchWithFilters(props, params);

        expect(props.router[0].query).to.have.all.keys('name', 'field');
      });

      it('removes params from query when value is ALL and field is in removedWhenAllFields', () => {
        const props = {
          ...defaultProps,
          router: [],
        };
        const params = [
          { field: 'field', value: 'value' },
          { field: 'remove', value: 'ALL' },
        ];
        const removeWhenAllFields = ['remove'];
        searchWithFilters(props, params, removeWhenAllFields);

        expect(props.router[0].query).to.have.all.keys('name', 'field');
      });
    });
  });
});
