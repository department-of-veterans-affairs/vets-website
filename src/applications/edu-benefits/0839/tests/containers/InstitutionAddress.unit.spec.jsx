import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import InstitutionAddress from '../../containers/InstitutionAddress';

const mockStore = configureStore([]);

describe('InstitutionAddress Component', () => {
  let store;

  describe('for main institution (isArrayItem = false)', () => {
    it('renders address when all fields are present', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionAddress: {
                street: '123 Main St',
                street2: 'Suite 100',
                street3: 'Building A',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const addressBlock = container.querySelector('#institutionAddress');
      expect(addressBlock).to.exist;
      expect(addressBlock.textContent).to.include('123 Main St');
      expect(addressBlock.textContent).to.include('Suite 100');
      expect(addressBlock.textContent).to.include('Building A');
      expect(addressBlock.textContent).to.include('Boston, MA 02101');
      expect(addressBlock.textContent).to.include('USA');
    });

    it('renders address without optional street2 and street3', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionAddress: {
                street: '456 Oak Ave',
                city: 'Cambridge',
                state: 'MA',
                postalCode: '02138',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const addressBlock = container.querySelector('#institutionAddress');
      expect(addressBlock).to.exist;
      expect(addressBlock.textContent).to.include('456 Oak Ave');
      expect(addressBlock.textContent).to.include('Cambridge, MA 02138');
      expect(addressBlock.textContent).to.not.include('Suite');
      expect(addressBlock.textContent).to.not.include('Building');
    });

    it('shows additional info when address is present and no warning banner', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: true,
              ihlEligible: true,
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.exist;
      expect(additionalInfo.getAttribute('trigger')).to.include(
        'What to do if this name or address looks incorrect',
      );
    });

    it('hides additional info when warning banner should be shown (not YR eligible)', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: true,
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.not.exist;
    });

    it('hides additional info when warning banner should be shown (not IHL eligible)', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              ihlEligible: false,
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.not.exist;
    });

    it('renders -- when address is not present', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const placeholder = container.querySelector('[aria-hidden="true"]');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.equal('--');
    });

    it('renders -- when address is empty object', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionAddress: {},
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const placeholder = container.querySelector('[aria-hidden="true"]');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.equal('--');
    });

    it('uses default dataPath when ui:options not provided', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {};

      const { container } = render(
        <Provider store={store}>
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const addressBlock = container.querySelector('#institutionAddress');
      expect(addressBlock).to.exist;
      expect(addressBlock.textContent).to.include('123 Main St');
    });
  });

  describe('for additional institution (isArrayItem = true)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/0' },
      });
    });

    it('renders address from array at index 0', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionAddress: {
                  street: '789 Tech Blvd',
                  city: 'Palo Alto',
                  state: 'CA',
                  postalCode: '94301',
                  country: 'USA',
                },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const addressBlock = container.querySelector('#institutionAddress');
      expect(addressBlock).to.exist;
      expect(addressBlock.textContent).to.include('789 Tech Blvd');
      expect(addressBlock.textContent).to.include('Palo Alto, CA 94301');
    });

    it('renders address from array at index 1', () => {
      window.location.pathname = '/1';
      const state = {
        form: {
          data: {
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                institutionAddress: {
                  street: '100 First St',
                  city: 'Boston',
                  state: 'MA',
                  postalCode: '02101',
                  country: 'USA',
                },
              },
              {
                facilityCode: '22222222',
                institutionAddress: {
                  street: '200 Second Ave',
                  city: 'Cambridge',
                  state: 'MA',
                  postalCode: '02138',
                  country: 'USA',
                },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const addressBlock = container.querySelector('#institutionAddress');
      expect(addressBlock).to.exist;
      expect(addressBlock.textContent).to.include('200 Second Ave');
      expect(addressBlock.textContent).to.include('Cambridge, MA 02138');
    });

    it('renders -- when address not present in array item', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const placeholder = container.querySelector('[aria-hidden="true"]');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.equal('--');
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const placeholder = container.querySelector('[aria-hidden="true"]');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.equal('--');
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const placeholder = container.querySelector('[aria-hidden="true"]');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.equal('--');
    });
  });

  describe('aria-live region', () => {
    it('has aria-live attribute for accessibility', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              institutionAddress: {
                street: '123 Main St',
                city: 'Boston',
                state: 'MA',
                postalCode: '02101',
                country: 'USA',
              },
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
          <InstitutionAddress uiSchema={uiSchema} />
        </Provider>,
      );

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).to.exist;
    });
  });
});
