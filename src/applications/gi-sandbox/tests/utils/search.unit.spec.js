import { expect } from 'chai';
import sinon from 'sinon';
import { searchWithFilters } from '../../utils/search';

const defaultProps = () => ({
  search: {
    inProgress: false,
  },
  field: '',
  value: '',
  query: '',
  pathname: '/search',
  history: { push: sinon.spy() },
  clearAutocompleteSuggestions: sinon.spy(),
});

describe('Search helpers:', () => {
  describe('searchWithFilters', () => {
    describe('does not query to router', () => {
      it('when search in progress', () => {
        const props = {
          ...defaultProps(),
          search: { inProgress: true },
        };

        searchWithFilters(props);
        expect(props.history.push.called).to.be.false;
      });

      it('when query is not changed', () => {
        const props = {
          ...defaultProps(),
          router: [],
        };
        searchWithFilters(props);
        expect(props.history.push.called).to.be.false;
      });
    });

    describe('updates query', () => {
      it('adds params to query', () => {
        const props = {
          ...defaultProps(),
          field: 'field',
          value: 'value',
        };
        searchWithFilters(props);
        expect(
          props.history.push.calledWith({
            pathname: '/search',
            search: 'field=value',
          }),
        ).to.be.true;
      });

      it('clears autocomplete results', () => {
        const props = {
          ...defaultProps(),
          field: 'field',
          value: 'value',
        };
        searchWithFilters(props);

        expect(props.clearAutocompleteSuggestions.called).to.be.true;
      });

      it('removes params from query when value is false', () => {
        const props = {
          ...defaultProps(),
          field: 'empty',
          value: false,
          query: 'name=test&empty=true',
        };
        searchWithFilters(props);
        expect(
          props.history.push.calledWith({
            pathname: '/search',
            search: 'name=test',
          }),
        ).to.be.true;
      });

      it('removes params from query when value is ALL and field is in removedWhenAllFields', () => {
        const props = {
          ...defaultProps(),
          field: 'country',
          value: 'ALL',
          query: 'name=test&country=USA',
        };
        searchWithFilters(props);

        expect(
          props.history.push.calledWith({
            pathname: '/search',
            search: 'name=test',
          }),
        ).to.be.true;
      });
    });
  });
});
