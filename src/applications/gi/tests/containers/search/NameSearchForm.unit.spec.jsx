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
  it('should show Learn more about community focus filters when Go to community focus details button is Clicked', () => {
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {
        ...noFilters,
        search: false,
      },
      preview: { version: '1' },
      search: { query: { name: 'some name' }, tab: null, loadFromUrl: true },
    };
    const { getByRole } = renderWithStoreAndRouter(
      <NameSearchForm smallScreen={false} {...props} />,
      {
        initialState: {
          constants: mockConstants(),
          filters: { ...noFilters, search: false },
          search: {
            ...mockSearchResults,
            query: { name: null },
            loadFromUrl: false,
          },
        },
      },
    );
    const btn = getByRole('button', { name: 'Go to community focus details' });
    userEvent.click(btn);
    const heading = getByRole('heading', {
      name: 'Historically Black Colleges and Universities',
    });
    const heandingTwo = getByRole('heading', {
      name: 'Men’s colleges and universities',
    });
    expect(heandingTwo).to.exist;
    expect(heading).to.exist;
  });
  it('should expand when Learn more about community focus filters button is clicked', () => {
    const props = {
      autocomplete: { nameSuggestions: [] },
      filters: {
        ...noFilters,
        search: false,
      },
      preview: { version: '1' },
      search: { query: { name: 'some name' }, tab: null, loadFromUrl: true },
    };
    const { getByRole } = renderWithStoreAndRouter(
      <NameSearchForm smallScreen={false} {...props} />,
      {
        initialState: {
          constants: mockConstants(),
          filters: { ...noFilters, search: false },
          search: {
            ...mockSearchResults,
            query: { name: null },
            loadFromUrl: false,
          },
        },
      },
    );
    const btn = getByRole('button', {
      name: 'Learn more about community focus filters',
    });
    expect(btn).to.have.attribute('aria-expanded', 'false');
    userEvent.click(btn);
    expect(btn).to.have.attribute('aria-expanded', 'true');
    const heading = getByRole('heading', {
      name: 'Historically Black Colleges and Universities',
    });
    expect(heading).to.exist;
    userEvent.click(btn);
    expect(btn).to.have.attribute('aria-expanded', 'false');
  });
  describe('specialMissions', () => {
    let sandbox;
    let fetchStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      fetchStub = sandbox.stub(global, 'fetch').callsFake(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });
    });
    const setupRTL = (
      value,
      testId,
      clearFilterbtn = null,
      applyFilter = null,
    ) => {
      const props = {
        autocomplete: { nameSuggestions: [] },
        filters: {
          excludeCautionFlags: false,
        },
        preview: { version: '1' },
        search: {
          query: { name: 'some name' },
          tab: 'name',
          loadFromUrl: true,
        },
      };
      const doSearchSpy = sinon.spy();
      const { getByRole, getByTestId } = renderWithStoreAndRouter(
        <NameSearchForm
          doSearch={doSearchSpy}
          smallScreen={false}
          {...props}
          dispatchFetchSearchByNameResults={() => {}}
        />,
        {
          initialState: {
            constants: mockConstants(),
            filters: { ...noFilters, search: false },
            search: {
              ...mockSearchResults,
              query: { name: '' },
              loadFromUrl: false,
            },
          },
        },
      );
      if (testId) {
        const checkbox = getByTestId(testId);
        expect(checkbox).to.exist;
        userEvent.click(checkbox);
      }
      if (clearFilterbtn) {
        const clearFilter = getByRole('button', { name: clearFilterbtn });
        expect(clearFilter).to.exist;
        userEvent.click(clearFilter);
      }
      if (applyFilter) {
        const applyFilteBTN = getByRole('button', { name: applyFilter });
        expect(applyFilteBTN).to.exist;
        userEvent.click(applyFilteBTN);
      }
      const searchInput = getByRole('combobox');
      userEvent.type(searchInput, value);
      const searchButton = getByRole('button', { name: 'Search' });
      userEvent.click(searchButton);
      const newValue = value.replace(' ', '%20');
      const expectedBaseUrl =
        'https://dev-api.va.gov/v1/gi/institutions/search';

      return { newValue, expectedBaseUrl, searchButton };
    };
    it('should remove public school type when PUBLIC checkbox is unchecked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'school-type-Public',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should remove public school type when For profit checkbox is unchecked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'school-type-For profit',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should remove all school type, excludeVettec and excludeEmployers when clear fillters button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        null,
        'Clear filters',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&exclude_schools=true&exclude_employers=true&exclude_vettec=true`,
      );
    });
    it('should add special-mission-hbcuall when button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'special-mission-hbcu',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&special_mission_hbcu=true&exclude_schools=true&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should add specialMissionMenonly when button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'special-mission-menonly',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&special_mission_menonly=true&exclude_schools=true&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should add special-mission-womenonly when button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'special-mission-womenonly',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&special_mission_womenonly=true&exclude_schools=true&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should add exclude-caution-flags when button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL(
        'new jersey',
        'exclude-caution-flags',
      );

      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&exclude_caution_flags=true&exclude_schools=true&exclude_employers=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should remove employers when button is clicked ', async () => {
      const { newValue, expectedBaseUrl } = setupRTL('new jersey', 'employers');
      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=${newValue}&page=1&exclude_schools=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
    it('should call url when apply filters button is clicked ', async () => {
      const { expectedBaseUrl } = setupRTL(
        '',
        'employers',
        null,
        'Apply filters',
      );
      const fetchUrl = fetchStub.firstCall.args[0];
      expect(fetchUrl.startsWith(expectedBaseUrl)).to.be.true;
      expect(fetchUrl).to.include(
        `${expectedBaseUrl}?name=&page=1&exclude_schools=true&exclude_vettec=true&excluded_school_types%5B%5D=PUBLIC&excluded_school_types%5B%5D=FOR%20PROFIT&excluded_school_types%5B%5D=PRIVATE&excluded_school_types%5B%5D=FOREIGN&excluded_school_types%5B%5D=FLIGHT&excluded_school_types%5B%5D=CORRESPONDENCE&excluded_school_types%5B%5D=HIGH%20SCHOOL`,
      );
    });
  });
});
