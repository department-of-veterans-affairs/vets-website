import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import configureStore from 'redux-mock-store';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import SelectHealthCareSystem from '../../containers/SelectHealthCareSystem';

const mockStore = configureStore([]);
let store;

const defaultFacilities = ['123', '456'];
const ehrDataByVhaId = {
  '123': { vamcSystemName: 'VA Boston' },
  '456': { vamcSystemName: 'VA Seattle' },
};

beforeEach((facilities = defaultFacilities) => {
  store = mockStore({
    sm: {
      recipients: {
        allFacilities: facilities,
      },
    },
    vamcEhrData: {
      vamcEhrDataByVhaId: ehrDataByVhaId,
    },
  });
});

const initialState = {
  sm: {
    recipients: {
      allFacilities: defaultFacilities,
    },
  },
  vamcEhrData: {
    vamcEhrDataByVhaId: ehrDataByVhaId,
  },
};
describe('SelectHealthCareSystem', () => {
  it('renders the heading and radio options', () => {
    const screen = renderWithStoreAndRouter(<SelectHealthCareSystem />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_HEALTH_CARE_SYSTEM,
      store,
    });

    expect(
      screen.getByRole('heading', {
        name: /Which VA health care system do you want to send a message to?/i,
      }),
    ).to.exist;
    const vaRadio = screen.container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Select the VA health care system your care team is a part of to send them a message',
    );
    const vaRadioOption = screen.container.querySelector('va-radio-option');
    expect(vaRadioOption).to.exist;

    expect(vaRadioOption.getAttribute('id')).to.equal('123');
    expect(screen.getByTestId('facility-123')).to.exist;
    expect(screen.getByTestId('facility-456')).to.exist;
  });

  it('sets error attribute on va-radio after clicking Continue with no selection', () => {
    renderWithStoreAndRouter(<SelectHealthCareSystem />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_HEALTH_CARE_SYSTEM,
      store,
    });
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'Select a VA health care system',
    );
  });

  it('removes error when a facility is selected after error', () => {
    renderWithStoreAndRouter(<SelectHealthCareSystem />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_HEALTH_CARE_SYSTEM,
      store,
    });
    $('va-button-pair').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'Select a VA health care system',
    );
    expect($('va-radio-option').radioOptionSelected).to.equal('');

    $('va-radio').__events.vaValueChange({
      detail: {
        value: '123',
      },
    }); // select radio
    expect($('va-radio-option').radioOptionSelected).to.equal('123');
    expect($('va-radio')).to.not.have.attribute(
      'error',
      'Select a VA health care system',
    );
  });

  it('displays health care system facilities as radio button options', async () => {
    const screen = renderWithStoreAndRouter(<SelectHealthCareSystem />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_HEALTH_CARE_SYSTEM,
      store,
    });
    expect(screen.getByTestId('facility-123')).to.exist; // VA Boston
    expect(screen.getByTestId('facility-456')).to.exist; // VA Seattle
    // Check the number of radio options
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(2);
  });
});
