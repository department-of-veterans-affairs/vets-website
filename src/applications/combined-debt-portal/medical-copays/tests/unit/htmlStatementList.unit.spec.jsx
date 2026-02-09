import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import HTMLStatementList from '../../components/HTMLStatementList';
import HTMLStatementLink from '../../components/HTMLStatementLink';

describe('HTMLStatementList', () => {
  const createMockStore = state => {
    return createStore(() => state);
  };

  describe('when showVHAPaymentHistory is true', () => {
    it('should render when recentCopays exist and filter out current statement', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {
              attributes: {
                recentCopays: [
                  { id: '1', invoiceDate: '2024-01-01' },
                  { id: '2', invoiceDate: '2024-02-01' },
                  { id: '3', invoiceDate: '2024-03-01' },
                ],
              },
            },
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="2" />
        </Provider>,
      );

      expect(wrapper.find('[data-testid="view-statements"]')).to.have.lengthOf(
        1,
      );
      expect(wrapper.find(HTMLStatementLink)).to.have.lengthOf(2);
      wrapper.unmount();
    });

    it('should return null when recentCopays is empty', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {
              attributes: {
                recentCopays: [],
              },
            },
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should return null when recentCopays does not exist', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {
              attributes: {},
            },
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should not sort statements (render in original order)', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {
              attributes: {
                recentCopays: [
                  { id: '1', invoiceDate: '2024-01-01' },
                  { id: '3', invoiceDate: '2024-03-01' },
                  { id: '2', invoiceDate: '2024-02-01' },
                  { id: '4', invoiceDate: '2024-04-01' },
                ],
              },
            },
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="4" />
        </Provider>,
      );

      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(3); // 4 total minus the selected one
      // Verify they're in the original order (VHA doesn't sort, excludes id "4")
      expect(links.at(0).prop('statementDate')).to.equal('2024-01-01');
      expect(links.at(1).prop('statementDate')).to.equal('2024-03-01');
      expect(links.at(2).prop('statementDate')).to.equal('2024-02-01');
      wrapper.unmount();
    });

    it('should render correct heading and description text', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {
              attributes: {
                recentCopays: [{ id: '1', invoiceDate: '2024-01-01' }],
              },
            },
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="999" />
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
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: [
              {
                id: '1',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '01/01/2024',
              },
              {
                id: '2',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '02/01/2024',
              },
              {
                id: '3',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '03/01/2024',
              },
            ],
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="2" />
        </Provider>,
      );

      expect(wrapper.find('[data-testid="view-statements"]')).to.have.lengthOf(
        1,
      );
      expect(wrapper.find(HTMLStatementLink)).to.have.lengthOf(2);
      wrapper.unmount();
    });

    it('should return null when no statements match facility', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: [
              {
                id: '1',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '01/01/2024',
              },
            ],
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should return null when allStatements is empty', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: [],
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should only show statements from the same facility', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: [
              {
                id: '1',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '01/01/2024',
              },
              {
                id: '2',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '02/01/2024',
              },
              {
                id: '3',
                station: { stationNumber: '456' },
                pSStatementDateOutput: '03/01/2024',
              },
            ],
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      // Should only show statement from facility 123 (excluding selected)
      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(1);
      expect(links.at(0).prop('id')).to.equal('2');
      wrapper.unmount();
    });

    it('should sort legacy statements by date descending', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: [
              {
                id: '1',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '01/01/2024',
              },
              {
                id: '2',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '03/01/2024',
              },
              {
                id: '3',
                station: { stationNumber: '123' },
                pSStatementDateOutput: '02/01/2024',
              },
            ],
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      const links = wrapper.find(HTMLStatementLink);
      expect(links).to.have.lengthOf(2); // Changed from 3 to 2 (excludes selectedId "1")
      // Should be sorted newest first (excludes id "1")
      expect(links.at(0).prop('statementDate')).to.equal('03/01/2024');
      expect(links.at(1).prop('statementDate')).to.equal('02/01/2024');
      wrapper.unmount();
    });
  });

  describe('edge cases', () => {
    it('should handle missing selectedStatement gracefully', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
        combinedPortal: {
          mcp: {},
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });

    it('should handle null statements array gracefully', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: {},
            statements: null,
          },
        },
      };

      const store = createMockStore(mockState);
      const wrapper = mount(
        <Provider store={store}>
          <HTMLStatementList selectedId="1" />
        </Provider>,
      );

      expect(wrapper.find(HTMLStatementList).children()).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });
});
