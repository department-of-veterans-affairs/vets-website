import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WarningBanner from '../../containers/WarningBanner';

const mockStore = configureStore([]);

describe('WarningBanner Component', () => {
  let store;

  describe('for main institution (isArrayItem = false)', () => {
    it('does not render when institution is eligible', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: true,
              ihlEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('renders warning when institution is not YR eligible', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.textContent).to.include(
        'This institution is unable to participate in the Yellow Ribbon Program',
      );
      expect(alert.textContent).to.include(
        'You can enter a main or branch campus facility code to continue',
      );
    });

    it('renders warning when institution is YR eligible but not IHL', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: true,
              ihlEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        'This institution is unable to participate in the Yellow Ribbon Program',
      );
      expect(alert.textContent).to.not.include('main or branch campus');
    });

    it('does not render when institution is not found', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'not found',
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when facility code is not 8 characters', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '1234',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render while loading', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: false,
              isLoading: true,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('uses default dataPath when ui:options not provided', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {};

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });

  describe('for additional institution (isArrayItem = true)', () => {
    const mainInstitution = {
      facilityCode: '12345678',
      facilityMap: {
        branches: ['11111111', '22222222'],
        extensions: ['33333333', '44444444'],
      },
    };

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/0' },
      });
    });

    it('renders warning when code has X in third position', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12X45678',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        "This facility code can't be accepted",
      );
      expect(alert.textContent).to.include('WEAMS 22-1998 Report');
    });

    it('renders warning when code is not in branches or extensions', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '99999999',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        "This facility code can't be accepted because it's not associated with your main campus",
      );
    });

    it('does not render when code is in branches', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when code is in extensions', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '33333333',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('renders warning for second array item when appropriate', () => {
      window.location.pathname = '/1';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
              {
                facilityCode: '88888888',
                yrEligible: true,
                ihlEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('does not render when institution is not found', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12345678',
                institutionName: 'not found',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });

  describe('edge cases', () => {
    it('handles missing formData gracefully', () => {
      const state = {
        form: {
          data: {},
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('handles missing form state gracefully', () => {
      const state = {};
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('handles empty facility code', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '',
              yrEligible: false,
              ihlEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });

  describe('alert attributes', () => {
    it('renders with correct alert attributes', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.hasAttribute('visible')).to.be.true;
      expect(alert.hasAttribute('background-only')).to.be.true;
      expect(alert.getAttribute('className')).to.equal('vads-u-margin-top--2');
    });
  });
});
