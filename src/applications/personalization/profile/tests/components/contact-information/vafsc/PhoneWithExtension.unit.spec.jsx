import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import { FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';

import PhoneWithExtension from '@@profile/components/contact-information/phone-numbers/vafsc/PhoneWithExtension';

import {
  createBasicInitialState,
  createFeatureTogglesState,
  createVapServiceState,
  buildRenderFormikFormWithRedux,
} from '../../../unit-test-helpers';

const formSchema = {
  type: 'object',
  properties: {
    'view:noInternationalNumbers': {
      type: 'object',
      properties: {},
    },
    inputPhoneNumber: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    extension: {
      type: 'string',
      pattern: '^\\s*[a-zA-Z0-9]{0,10}\\s*$',
    },
  },
  required: ['inputPhoneNumber'],
};

const uiSchema = {
  inputPhoneNumber: {
    'ui:title': 'Home phone number (U.S. numbers only)',
    'ui:errorMessages': {
      pattern: 'Please enter a valid 10-digit U.S. phone number.',
    },
    'ui:options': {
      ariaDescribedby: 'error-message-details',
    },
  },
  extension: {
    'ui:title': 'Extension',
    'ui:errorMessages': {
      pattern: 'Please enter a valid extension.',
    },
  },
};

const initialValues = {
  areaCode: '989',
  countryCode: '1',
  createdAt: '2018-04-20T17:22:56.000Z',
  effectiveEndDate: null,
  effectiveStartDate: '2022-03-11T16:31:55.000Z',
  extension: '123',
  id: 2272982,
  inputPhoneNumber: '9898981233',
  isInternational: false,
  isTextPermitted: null,
  isTextable: null,
  isTty: null,
  isVoicemailable: null,
  phoneNumber: '8981233',
  phoneType: 'HOME',
  sourceDate: '2022-03-11T16:31:55.000Z',
  sourceSystemUser: null,
  transactionId: '2814cdf6-7f2c-431b-95f3-d37f3837215d',
  updatedAt: '2022-03-11T16:31:56.000Z',
  vet360Id: '1273766',
};

const ui = (
  <MemoryRouter>
    <PhoneWithExtension
      formSchema={formSchema}
      uiSchema={uiSchema}
      fieldName={FIELD_NAMES.HOME_PHONE}
    />
  </MemoryRouter>
);

let render;
let formikView;
const initialState = {
  ...createBasicInitialState(),
  ...createFeatureTogglesState(),
  ...createVapServiceState(),
};

describe('Editing', () => {
  beforeEach(() => {
    render = buildRenderFormikFormWithRedux(initialValues, initialState);
    formikView = render(ui);
  });

  it('should render phone field with formatted label and data passed', async () => {
    const field = formikView.getByTestId('phoneField');

    expect(field).to.exist;
    expect(field).to.have.attribute(
      'label',
      `${FIELD_TITLES[FIELD_NAMES.HOME_PHONE]} (U.S. numbers only)`,
    );
    expect(field).to.have.attribute('name', 'inputPhoneNumber');
    expect(field).to.have.attribute('value', initialValues.inputPhoneNumber);
    expect(field).to.have.attribute('required', 'true');
  });

  it('should render extension field with formatted label and data passed', async () => {
    const field = formikView.getByTestId('extensionField');

    expect(field).to.exist;
    expect(field).to.have.attribute('label', 'Extension');
    expect(field).to.have.attribute('name', 'extension');
    expect(field).to.have.attribute('value', initialValues.extension);
    expect(field).to.have.attribute('required', 'false');
  });
});
