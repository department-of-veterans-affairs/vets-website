import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import NameSearchForm from '../../../containers/search/NameSearchForm';
import {
  mockConstants,
  renderWithStoreAndRouter,
  noFilters,
  mockSearchResults,
} from '../../helpers';

describe('<NameSearchForm>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<NameSearchForm />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
  it('renders without crashing', () => {
    const dispatchFetchSearchByNameResultsSpy = sinon.spy();
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {},
      preview: { version: '1' },
      search: { query: { name: 'name' }, tab: null, loadFromUrl: false },
    };
    const screen = renderWithStoreAndRouter(
      <NameSearchForm
        dispatchFetchSearchByNameResults={dispatchFetchSearchByNameResultsSpy}
        {...props}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    const btn = screen.getByRole('button', { name: 'Search' });
    expect(btn).to.exist;
  });
  it('dispatches the correct actions on search', async () => {
    const dispatchFetchSearchByNameResultsSpy = sinon.spy();
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {},
      preview: { version: '1' },
      search: { query: { name: '' }, tab: null, loadFromUrl: false },
    };

    const screen = renderWithStoreAndRouter(
      <NameSearchForm
        dispatchFetchSearchByNameResults={dispatchFetchSearchByNameResultsSpy}
        {...props}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    const input = screen.getByLabelText(
      'School, employer, or training provider',
    );
    userEvent.type(input, 'Test School');
    const btn = screen.getByRole('button', { name: 'Search' });
    userEvent.click(btn);
    await waitFor(() => {
      expect(dispatchFetchSearchByNameResultsSpy.called).to.be.false;
      expect(
        dispatchFetchSearchByNameResultsSpy.calledWith(
          'Test School',
          1,
          props.filters,
          props.preview.version,
        ),
      ).to.be.false;
    });
  });
  it('validates empty search term correctly', async () => {
    const validateSearchTermSpy = sinon.spy();
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {
        excludeCautionFlags: false,
      },
      preview: { version: '1' },
      search: { query: { name: 'some name' }, tab: null, loadFromUrl: false },
    };
    const screen = renderWithStoreAndRouter(
      <NameSearchForm validateSearchTerm={validateSearchTermSpy} {...props} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const input = screen.getByRole('combobox');
    userEvent.type(input, '');
    const submitButton = screen.getByRole('button', { name: 'Search' });
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(validateSearchTermSpy.calledWith('')).to.be.false;
      expect(
        screen.getByText(
          'Please fill in a school, employer, or training provider.',
        ),
      ).to.exist;
    });
  });
  it('validates with no filters selected', async () => {
    const validateSearchTermSpy = sinon.spy();
    const doSearchSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <NameSearchForm
        validateSearchTerm={validateSearchTermSpy}
        doSearch={doSearchSpy}
        filters={{
          ...noFilters,
          employers: false,
          vettec: false,
          schools: false,
        }}
      />,
      {
        initialState: {
          constants: mockConstants(),
          filters: {
            ...noFilters,
            employers: false,
            vettec: false,
            schools: false,
          },
        },
      },
    );
    const input = screen.getByLabelText(
      'School, employer, or training provider',
    );
    userEvent.type(input, 'Test School');
    const submitButton = screen.getByRole('button', { name: 'Search' });
    await waitFor(() => {
      userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(validateSearchTermSpy.calledWith('')).to.be.false;
      expect(screen.queryByText('Please select at least one filter.')).to.exist;
    });
  });
  it('should call doSearch with search?.query?.name', () => {
    const validateSearchTermSpy = sinon.spy();
    const doSearchSpy = sinon.spy();
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {
        ...noFilters,
        search: true,
      },
      preview: { version: '1' },
      search: { query: { name: 'some name' }, tab: null, loadFromUrl: false },
    };
    renderWithStoreAndRouter(
      <NameSearchForm
        validateSearchTerm={validateSearchTermSpy}
        doSearch={doSearchSpy}
        {...props}
      />,
      {
        initialState: {
          constants: mockConstants(),
          filters: { ...noFilters, search: true },
        },
      },
    );
    expect(doSearchSpy.calledWith('some name')).to.be.false;
  });
  it('should not call doSearch with search?.query?.name is null', () => {
    const validateSearchTermSpy = sinon.spy();
    const doSearchSpy = sinon.spy();
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {
        ...noFilters,
        search: false,
      },
      preview: { version: '1' },
      search: { query: { name: 'some name' }, tab: null, loadFromUrl: true },
    };
    renderWithStoreAndRouter(
      <NameSearchForm
        validateSearchTerm={validateSearchTermSpy}
        doSearch={doSearchSpy}
        {...props}
      />,
      {
        initialState: {
          constants: mockConstants(),
          filters: { ...noFilters, search: false },
          search: {
            ...mockSearchResults,
            query: { name: 'some name' },
            loadFromUrl: true,
          },
        },
      },
    );
    expect(doSearchSpy.calledWith('some name')).to.be.false;
  });
});
