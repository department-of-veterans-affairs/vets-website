import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { cloneDeep } from 'lodash';

import { getFormDOM } from '../../util/schemaform-utils';
import { AddressSection } from '../../../src/js/letters/containers/AddressSection';
import { ADDRESS_TYPES } from '../../../src/js/letters/utils/constants';

const originalValidations = AddressSection.fieldValidations;
const spyOnValidators = () => {
  const validatorSpies = Object.keys(AddressSection.fieldValidations).reduce((spies, key) => {
    // Each property is an array of functions; wrap each function in a spy
    return Object.assign({}, spies, { [key]: AddressSection.fieldValidations[key].map((validator) => sinon.spy(validator)) });
  }, {});

  // Infiltrate!
  AddressSection.fieldValidations = validatorSpies;
};

const cleanUpSpies = () => {
  AddressSection.fieldValdiations = originalValidations;
};

const saveSpy = sinon.spy();

const defaultProps = {
  savedAddress: {
    type: ADDRESS_TYPES.domestic,
    addressOne: '2476 Main Street',
    addressTwo: '',
    addressThree: '',
    city: 'Reston',
    countryName: 'USA',
    stateCode: 'VA',
    zipCode: '12345'
  },
  canUpdate: true,
  saveAddress: saveSpy,
  savePending: false,
  countries: [],
  countriesAvailable: true,
  states: [],
  statesAvailable: true
};

describe('<AddressSection>', () => {
  // we expect a render with default props to show the AddressContent component
  it('should display an address if one is provided in props', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const addressContent = tree.dive(['AddressContent']);
    const contentHeader = addressContent.subTree('p').text();

    expect(contentHeader).to.contain('Downloaded documents will list your address as:');
  });

  it('should display an error message if address is empty', () => {
    const newProps = { ...defaultProps, savedAddress: {} };
    const tree = SkinDeep.shallowRender(<AddressSection {...newProps}/>);
    const invalidAddress = tree.subTree('p').text();

    expect(invalidAddress).to.contain('We’re encountering an error with your');
  });

  it('should display a loading spinner if address save in progress', () => {
    const newProps = { ...defaultProps, savePending: true };
    const tree = SkinDeep.shallowRender(<AddressSection {...newProps}/>);
    const spinner = tree.dive(['AddressContent', 'AddressBlock', 'LoadingIndicator']);
    expect(spinner.text()).to.contain('Updating your address...');
  });

  it('should format 1 address line', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();
    // NOTE: have to pass in uncapitalized addresses to assert against because shallowRender apparently strips caps...
    expect(addressBlockText).to.contain('2476 main street');
  });

  it('should format address 2 address lines', () => {
    const props = {
      ...defaultProps,
      savedAddress: {
        ...defaultProps.savedAddress,
        addressTwo: 'ste #12'
      }
    };

    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();

    expect(addressBlockText).to.contain('2476 main street, ste #12');
  });

  it('should format address 3 address lines', () => {
    const props = {
      ...defaultProps,
      savedAddress: {
        ...defaultProps.savedAddress,
        addressTwo: 'ste #12',
        addressThree: 'west'
      }
    };

    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);
    const addressBlock = tree.dive(['AddressContent', 'AddressBlock']);
    const addressBlockText = addressBlock.subTree('.address-block', 'div.letters-address').text();
    expect(addressBlockText).to.contain('2476 main street, ste #12 west');
  });

  it('should render an edit button if user is allowed to edit address', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const editButton = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');
    expect(editButton).to.not.be.empty;
  });

  it('should not render an edit button if user not allowed to edit address', () => {
    const cannotEditProps = { ...defaultProps, canUpdate: false };
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...cannotEditProps}/>);
    expect(() => ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button')).to.throw();
  });

  it('should expand address fields when Edit button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;
  });

  it('should collapse address fields when Update button is clicked', () => {
    saveSpy.reset();

    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;

    tree.click('button.usa-button-primary');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;
    expect(saveSpy.calledWith(component.state.editableAddress)).to.be.true;
  });

  it('should collapse address fields when Cancel button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.not.be.empty;

    tree.click('button.usa-button-outline');

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select')).to.be.empty;
  });

  // NOTE: This is a bit of a misnomer; it only tests if countries are unavailable, but that should be sufficient
  it('should show addressUpdateUnavailable if countries or states lists aren\'t available', () => {
    const props = Object.assign({}, defaultProps, { countriesAvailable: false });
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...props}/>);
    const tree = getFormDOM(component);

    // Start editing
    tree.click('button.usa-button-outline');
    expect(tree.getElement('.usa-alert-heading').textContent).to.contain('Address update unavailable');
  });

  it('should load address in new props after mounting', () => {
    const props = cloneDeep(defaultProps);
    props.savedAddress = {};
    const tree = SkinDeep.shallowRender(<AddressSection {...props}/>);

    const instance = tree.getMountedInstance();
    expect(instance.state.editableAddress).to.equal(props.savedAddress);

    const newProps = Object.assign({}, props, { savedAddress: { addressOne: '123 Main St' } });
    instance.componentWillReceiveProps(newProps);
    expect(instance.state.editableAddress).to.equal(newProps.savedAddress);
  });

  it('should not call saveAddress when Cancel is clicked', () => {
    saveSpy.reset();
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    // Start editing
    tree.click('button.usa-button-outline');

    // Try to save
    tree.click('button.usa-button-outline');
    expect(saveSpy.called).to.be.false;
  });

  it('should not call saveAddress when Update is clicked with invalid data', () => {
    saveSpy.reset();
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    // Start editing
    tree.click('button.usa-button-outline');

    // Clear out country to get a validation error
    tree.fillData('[name="country"]', '');

    // Try to save
    tree.click('button.usa-button-primary');
    expect(saveSpy.called).to.be.false;
  });

  it('should display error messages for validation failures', () => {
    const component = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
    const tree = getFormDOM(component);

    // Start editing
    tree.click('button.usa-button-outline');

    // Clear out country to get a validation error
    tree.fillData('[name="country"]', '');
    expect(tree.getElement('.usa-input-error')).to.not.be.null;
  });

  it('should infer new address type', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);

    // Sanity check; make sure the type is what we expect before we change it
    // NOTE: We're checking that it's domestic specifically just so we make absolutely sure
    //  it's getting _changed_ to international instead of accidentally starting off as
    //  international. Just a bit of future-proofing.
    const instance = tree.getMountedInstance();
    expect(instance.state.editableAddress.type).to.equal(ADDRESS_TYPES.domestic);

    // Change the country so it'll be international
    instance.handleChange('countryName', 'Elsweyre');
    expect(instance.state.editableAddress.type).to.equal(ADDRESS_TYPES.international);

    // NOTE: This isn't a _comprehensive_ test that ensures changing the input will do what we
    //  expect, but the e2e test should make sure that the wiring from the input to handleChange
    //  is up and running as expected.
  });

  it('should reset disallowed address fields when type changes', () => {
    const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);

    // Sanity check; make sure the type is what we expect before we change it
    const instance = tree.getMountedInstance();
    expect(instance.state.editableAddress.stateCode).to.not.equal('');

    // Change the country so it'll be international (and the state and zip fields should reset to '')
    instance.handleChange('countryName', 'Elsweyre');
    expect(instance.state.editableAddress.stateCode).to.equal('');
  });

  // Not sure how to test this bit yet...
  // it('should scroll to first error', () => {});

  describe('validation', () => {
    // Spy on all the validation functions!
    beforeEach(spyOnValidators);

    // Clean up the spies so nobody finds out
    afterEach(cleanUpSpies);

    it('should run all validations against a field if the address is valid', () => {
      const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
      const instance = tree.getMountedInstance();

      instance.handleChange('city', 'Elsweyre');
      instance.dirtyInput('city');
      expect(AddressSection.fieldValidations.city.every(validator => validator.called)).to.be.true;
    });

    it('should return the first error message it finds', () => {
      const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
      const instance = tree.getMountedInstance();

      instance.handleChange('city', '');
      instance.dirtyInput('city');
      // The required validator (first in the list) should return an error message and no other validators should run
      expect(AddressSection.fieldValidations.city[0].called).to.be.true;
      expect(AddressSection.fieldValidations.city.slice(1).every(validator => !validator.called)).to.be.true;
    });

    it('should run validations on modified fields only', () => {
      const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
      const instance = tree.getMountedInstance();

      const fieldsToModify = ['city', 'stateCode'];
      fieldsToModify.forEach(field => {
        instance.handleChange(field, '');
        instance.dirtyInput(field);
      });

      Object.keys(AddressSection.fieldValidations).forEach((key) => {
        const validationsCalled = AddressSection.fieldValidations[key].some(v => v.called);
        if (fieldsToModify.includes(key)) {
          expect(validationsCalled).to.be.true;
        } else {
          expect(validationsCalled).to.be.false;
        }
      });
    });

    it('should run validation against dropdowns immediately', () => {
      const tree = ReactTestUtils.renderIntoDocument(<AddressSection {...defaultProps}/>);
      const form = getFormDOM(tree);

      // Start editing
      form.click('.usa-button-outline');

      // Sanity check - Start with no errors
      expect(() => form.findElement('.usa-input-error')).to.throw();

      // Select no state and expect a validation error
      form.fillData('[name="state"]', '');
      expect(form.getElement('.usa-input-error').textContent).to.contain('Please select a state');

      // Select no country and expect a validation error
      // Note: When we select no country, the state error should disappear, so we have to
      //  make sure we're getting the _right_ error message
      form.fillData('[name="country"]', '');
      expect(form.getElement('.usa-input-error').textContent).to.contain('Please select a country');
    });

    it('should run validations on all fields before saving the address', () => {
      const tree = SkinDeep.shallowRender(<AddressSection {...defaultProps}/>);
      const instance = tree.getMountedInstance();

      instance.saveAddress();

      Object.keys(AddressSection.fieldValidations).forEach((key) => {
        expect(AddressSection.fieldValidations[key].some(v => v.called)).to.be.true;
      });
    });
  });
});
