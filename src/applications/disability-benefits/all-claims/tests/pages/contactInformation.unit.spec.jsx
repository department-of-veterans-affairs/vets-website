import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
// import moment from 'moment';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import {
  DefinitionTester, // selectCheckbox
} from 'platform/testing/unit/schemaform-utils.jsx';
import {
  STATE_VALUES,
  MILITARY_STATE_VALUES,
} from 'applications/disability-benefits/all-claims/constants';
import { commonReducer } from 'platform/startup/store';
import formConfig from '../../config/form.js';
import reducers from '../../reducers';

// const NEXT_YEAR = moment()
//   .add(1, 'year')
//   .format('YYYY-MM-DD');

/* eslint-disable camelcase */
describe('Disability benefits 526EZ contact information', () => {
  const fakeStore = createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
    }),
  );

  const {
    schema,
    uiSchema,
    updateFormData,
  } = formConfig.chapters.veteranDetails.pages.contactInformation;

  it('renders contact information form', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {},
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // street 1, 2, 3, city, phone, email, and overseas address checkbox
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('shows state and zip when country is USA', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {
              country: 'USA',
            },
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // country, state
    expect(form.find('select').length).to.equal(2);
    // street 1, 2, 3, city, zip, phone, email, and overseas address checkbox
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('hides state and zip when country is not USA', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {
              country: 'Afghanistan',
            },
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // country
    expect(form.find('select').length).to.equal(1);
    // street 1, 2, 3, city, phone, email, and overseas address checkbox
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('restricts state options to military state codes when city is a military city code', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {
              country: 'USA',
              city: 'APO',
            },
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const stateDropdownOptions = form.find(
      '#root_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(
      MILITARY_STATE_VALUES.length + 1,
    );
    form.unmount();
  });

  it('does not restrict state options  when city is not a military city code', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {
              country: 'USA',
              city: 'Detroit',
            },
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const stateDropdownOptions = form.find(
      '#root_mailingAddress_state > option',
    );
    // The `+1` is for the empty option in the dropdown
    expect(stateDropdownOptions.length).to.equal(STATE_VALUES.length + 1);
    form.unmount();
  });

  it('validates that state is military type if city is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            phoneAndEmail: {
              primaryPhone: '1231231231',
              emailAddress: 'a@b.co',
            },
            mailingAddress: {
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'APO',
              state: 'TX',
              zipCode: '12345',
            },
          }}
          formData={{}}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('validates that city is military type if state is military type', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            phoneAndEmail: {
              primaryPhone: '1231231231',
              emailAddress: 'a@b.co',
            },
            mailingAddress: {
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'Anytown',
              state: 'AA',
              zipCode: '12345',
            },
          }}
          formData={{}}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('disables the country dropdown when overseas address is checked', () => {
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            mailingAddress: {
              'view:livesOnMilitaryBase': true,
              country: 'USA',
            },
            phoneAndEmail: {},
          }}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // country
    expect(
      form
        .find('select')
        .at(0)
        .prop('disabled'),
    ).to.be.true;
    form.unmount();
  });

  // it('expands forwarding address fields when forwarding address checked', () => {
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={{
  //         'view:hasForwardingAddress': true,
  //         mailingAddress: {
  //           country: '',
  //           addressLine1: '',
  //         },
  //         forwardingAddress: {
  //           country: '',
  //           addressLine1: '',
  //         },
  //         phoneAndEmail: {},
  //       }}
  //       formData={{}}
  //       uiSchema={uiSchema}
  //     />,
  //   );

  //   // (2 x country), 2x date month, 2x date day, country
  //   expect(form.find('select').length).to.equal(6);
  //   // (2 x (street 1, 2, 3, city)), phone, email, fwding address checkbox, 2x date year
  //   expect(form.find('input').length).to.equal(13);
  //   form.unmount();
  // });

  // it('validates that forwarding state is military type if forwarding city is military type', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={{
  //         phoneAndEmail: {
  //           primaryPhone: '1231231231',
  //           emailAddress: 'a@b.co',
  //         },
  //         mailingAddress: {
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Anytown',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //         'view:hasForwardingAddress': true,
  //         forwardingAddress: {
  //           effectiveDate: {
  //             from: NEXT_YEAR,
  //           },
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'APO',
  //           state: 'TX',
  //           zipCode: '12345',
  //         },
  //       }}
  //       formData={{}}
  //       uiSchema={uiSchema}
  //       onSubmit={onSubmit}
  //     />,
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error-message').length).to.equal(1);
  //   expect(onSubmit.called).to.be.false;
  //   form.unmount();
  // });

  // it('validates that forwarding city is military type if forwarding state is military type', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={{
  //         phoneAndEmail: {
  //           primaryPhone: '1231231231',
  //           emailAddress: 'a@b.co',
  //         },
  //         mailingAddress: {
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Anytown',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //         'view:hasForwardingAddress': true,
  //         forwardingAddress: {
  //           effectiveDate: {
  //             from: NEXT_YEAR,
  //           },
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Anytown',
  //           state: 'AA',
  //           zipCode: '12345',
  //         },
  //       }}
  //       formData={{}}
  //       uiSchema={uiSchema}
  //       onSubmit={onSubmit}
  //     />,
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error-message').length).to.equal(1);
  //   expect(onSubmit.called).to.be.false;
  //   form.unmount();
  // });

  // it('validates that effective date is in the future', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={{
  //         phoneAndEmail: {
  //           primaryPhone: '1231231231',
  //           emailAddress: 'a@b.co',
  //         },
  //         mailingAddress: {
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Anytown',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //         'view:hasForwardingAddress': true,
  //         forwardingAddress: {
  //           effectiveDate: {
  //             from: '2018-10-12',
  //           },
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Detroit',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //       }}
  //       formData={{}}
  //       uiSchema={uiSchema}
  //       onSubmit={onSubmit}
  //     />,
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error-message').length).to.equal(1);
  //   expect(onSubmit.called).to.be.false;
  //   form.unmount();
  // });

  // it('validates that effective end date is after start date', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       data={{
  //         phoneAndEmail: {
  //           primaryPhone: '1231231231',
  //           emailAddress: 'a@b.co',
  //         },
  //         mailingAddress: {
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Anytown',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //         'view:hasForwardingAddress': true,
  //         forwardingAddress: {
  //           effectiveDate: {
  //             from: '2099-10-12',
  //             to: '2099-10-12',
  //           },
  //           country: 'USA',
  //           addressLine1: '123 Any Street',
  //           city: 'Detroit',
  //           state: 'MI',
  //           zipCode: '12345',
  //         },
  //       }}
  //       formData={{}}
  //       uiSchema={uiSchema}
  //       onSubmit={onSubmit}
  //     />,
  //   );

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error-message').length).to.equal(1);
  //   expect(onSubmit.called).to.be.false;
  //   form.unmount();
  // });

  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            phoneAndEmail: {
              primaryPhone: '',
              emailAddress: '',
            },
            mailingAddress: {
              country: '',
              addressLine1: '',
              city: '',
            },
            // 'view:hasForwardingAddress': true,
            // forwardingAddress: {
            //   effectiveDate: {
            //     from: '',
            //   },
            //   country: '',
            //   addressLine1: '',
            //   city: '',
            // },
          }}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('does submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            phoneAndEmail: {
              emailAddress: 'a@b.co',
            },
            mailingAddress: {
              country: 'USA',
              addressLine1: '123 Any Street',
              city: 'Anytown',
              state: 'MI',
              zipCode: '12345',
            },
            // 'view:hasForwardingAddress': true,
            // forwardingAddress: {
            //   effectiveDate: {
            //     from: NEXT_YEAR,
            //   },
            //   country: 'USA',
            //   addressLine1: '234 Maple St.',
            //   city: 'Detroit',
            //   state: 'MI',
            //   zipCode: '234563453',
            // },
          }}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('updateFormData', () => {
    const getFormData = (checkbox, city = '', state = '') => ({
      mailingAddress: {
        'view:livesOnMilitaryBase': checkbox,
        city,
        state,
      },
    });
    const empty = getFormData(true, '', '');
    const data = getFormData(false, 'city', 'state');
    it('should return current city & state', () => {
      const newData = getFormData(true, 'city', 'state');
      expect(updateFormData(empty, empty)).to.deep.equal(empty);
      expect(updateFormData(data, data)).to.deep.equal(data);
      expect(updateFormData(newData, newData)).to.deep.equal(newData);
    });
    it('should clear city & state when military checkbox is set', () => {
      const newData = getFormData(true, 'city', 'state');
      expect(updateFormData(data, newData)).to.deep.equal(empty);
    });
    it('should restore city & state when military checkbox is unset', () => {
      const oldData = getFormData(true, 'city', 'state');
      const newData = getFormData(false, 'city', 'state');
      expect(updateFormData(oldData, newData)).to.deep.equal(newData);
    });
    it('should restore city & state when military checkbox is unset', () => {
      const oldData = getFormData(true, 'city', 'state');
      const newData = getFormData(false, 'city', 'state');
      expect(updateFormData(oldData, newData)).to.deep.equal(newData);
    });
    it('should clear city if unchecked & military city is set', () => {
      // store original city & state in savedAddress
      const storeData = getFormData(true, 'city', 'state');
      updateFormData(data, storeData);
      // set military city & state, then test restoration
      const militarySet = getFormData(true, 'APO', 'AA');
      const result = getFormData(false, 'city', 'state');
      expect(updateFormData(militarySet, data)).to.deep.equal(result);
    });
  });
});
