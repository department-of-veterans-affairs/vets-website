import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PreviousStatements from '../../components/PreviousStatements';
import HTMLStatementLink from '../../components/HTMLStatementLink';

const createMockStore = state => createStore(() => state);

const baseState = {
  featureToggles: {
    [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
  },
  combinedPortal: {
    mcp: {
      selectedStatement: null,
      statements: [],
    },
  },
};

const createMockState = overrides => ({
  ...baseState,
  ...overrides,
  featureToggles: {
    ...baseState.featureToggles,
    ...overrides?.featureToggles,
  },
  combinedPortal: {
    ...baseState.combinedPortal,
    ...overrides?.combinedPortal,
    mcp: {
      ...baseState.combinedPortal.mcp,
      ...overrides?.combinedPortal?.mcp,
    },
  },
});

const vhaStatement = (id, invoiceDate) => ({
  id,
  invoiceDate,
});

const legacyStatement = (id, date, station = '123') => ({
  id,
  station: { stationNumber: station },
  pSStatementDateOutput: date,
});

const vhaState = recentStatements =>
  createMockState({
    featureToggles: {
      [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
    },
    combinedPortal: {
      mcp: {
        selectedStatement: {
          attributes: { recentStatements },
        },
      },
    },
  });

const vhaStateWithSelected = (recentStatements, selectedStatement) =>
  createMockState({
    featureToggles: {
      [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
    },
    combinedPortal: {
      mcp: {
        selectedStatement,
      },
    },
  });

const legacyState = statements =>
  createMockState({
    combinedPortal: {
      mcp: {
        statements,
      },
    },
  });

describe('PreviousStatements', () => {
  describe('when showVHAPaymentHistory is true', () => {
    it('should render when recentStatements exist and filter out current statement', () => {
      const store = createMockStore(
        vhaState([
          vhaStatement('1', '2024-01-01'),
          vhaStatement('2', '2024-02-01'),
          vhaStatement('3', '2024-03-01'),
        ]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="2" />
        </Provider>,
      );

      expect(wrapper.find('[data-testid="view-statements"]')).to.have.lengthOf(
        1,
      );
      expect(wrapper.find(HTMLStatementLink)).to.have.lengthOf(2);
      wrapper.unmount();
    });

    it('should return null when recentStatements is empty', () => {
      const store = createMockStore(vhaState([]));

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should return null when recentStatements does not exist', () => {
      const store = createMockStore(
        vhaStateWithSelected([], { attributes: {} }),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should not sort statements (render in original order)', () => {
      const store = createMockStore(
        vhaState([
          vhaStatement('1', '2024-01-01'),
          vhaStatement('3', '2024-03-01'),
          vhaStatement('2', '2024-02-01'),
          vhaStatement('4', '2024-04-01'),
        ]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="4" />
        </Provider>,
      );

      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(3);
      expect(links.at(0).prop('statementDate')).to.equal('2024-01-01');
      expect(links.at(1).prop('statementDate')).to.equal('2024-03-01');
      expect(links.at(2).prop('statementDate')).to.equal('2024-02-01');
      wrapper.unmount();
    });

    it('should render correct heading and description text', () => {
      const store = createMockStore(
        vhaState([vhaStatement('1', '2024-01-01')]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="999" />
        </Provider>,
      );

      expect(wrapper.find('h2').text()).to.equal('Previous statements');
      expect(wrapper.find('p').text()).to.include(
        'Review your charges and download your mailed statements from the past 6 months',
      );
      wrapper.unmount();
    });
  });

  describe('when showVHAPaymentHistory is false', () => {
    it('should render when previous statements exist and filter out current statement', () => {
      const store = createMockStore(
        legacyState([
          legacyStatement('1', '01/01/2024'),
          legacyStatement('2', '02/01/2024'),
          legacyStatement('3', '03/01/2024'),
        ]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="2" />
        </Provider>,
      );

      expect(wrapper.find('[data-testid="view-statements"]')).to.have.lengthOf(
        1,
      );
      expect(wrapper.find(HTMLStatementLink)).to.have.lengthOf(2);
      wrapper.unmount();
    });

    it('should return null when no statements match facility', () => {
      const store = createMockStore(
        legacyState([legacyStatement('1', '01/01/2024')]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should return null when allStatements is empty', () => {
      const store = createMockStore(legacyState([]));

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should only show statements from the same facility', () => {
      const store = createMockStore(
        legacyState([
          legacyStatement('1', '01/01/2024', '123'),
          legacyStatement('2', '02/01/2024', '123'),
          legacyStatement('3', '03/01/2024', '456'),
        ]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(1);
      expect(links.at(0).prop('id')).to.equal('2');
      wrapper.unmount();
    });

    it('should sort legacy statements by date descending', () => {
      const store = createMockStore(
        legacyState([
          legacyStatement('1', '01/01/2024'),
          legacyStatement('2', '03/01/2024'),
          legacyStatement('3', '02/01/2024'),
        ]),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(2);
      expect(links.at(0).prop('statementDate')).to.equal('03/01/2024');
      expect(links.at(1).prop('statementDate')).to.equal('02/01/2024');
      wrapper.unmount();
    });
  });

  describe('edge cases', () => {
    it('should handle missing selectedStatement gracefully', () => {
      const store = createMockStore(
        createMockState({
          featureToggles: {
            [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
          },
          combinedPortal: {
            mcp: {},
          },
        }),
      );

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should handle null statements array gracefully', () => {
      const store = createMockStore(legacyState(null));

      const wrapper = mount(
        <Provider store={store}>
          <PreviousStatements selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(PreviousStatements).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });
});
