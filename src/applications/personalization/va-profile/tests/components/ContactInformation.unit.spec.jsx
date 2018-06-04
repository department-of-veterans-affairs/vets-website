import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import ContactInformation, { ContactInformationContent } from '../../components/ContactInformation';

describe('<ContactInformation/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      fetchContactInformation() {},
      fetchAddressConstants() {},
      modal: {
        currentlyOpen: null,
        pendingSaves: [],
        formFields: {},
        errors: [],
        clearErrors() {}
      },
      profile: {
        contactInformation: {
          email: {},
          mailingAddress: {},
          primaryTelephone: {},
          alternateTelephone: {}
        },
        addressConstants: {}
      },
      updateFormFieldActions: {},
      updateActions: {}
    };
  });

  it('should render', () => {
    const wrapper = enzyme.shallow(<ContactInformation {...props}/>);
    expect(wrapper.text()).to.contain('Contact Information');
    expect(wrapper.find('ContactInformationContent')).to.have.lengthOf(1);
  });

  it('should render inner form components', () => {
    let wrapper = enzyme.shallow(<ContactInformationContent {...props}/>);
    wrapper = wrapper.find('LoadingSection').dive();

    expect(wrapper.find('AddressSection')).to.have.lengthOf(1);
    expect(wrapper.find('PhoneSection')).to.have.lengthOf(2);
    expect(wrapper.find('EmailSection')).to.have.lengthOf(1);
  });

  it('should render an error when all fields have errors associated and a specialized message for error code 403', () => {
    props.profile.contactInformation.email = {
      error: {
        errors: [
          {
            code: '403'
          }
        ]
      }
    };
    props.profile.contactInformation.mailingAddress = { error: {} };
    props.profile.contactInformation.primaryTelephone = { error: {} };
    props.profile.contactInformation.alternateTelephone = { error: {} };

    let wrapper = enzyme.shallow(<ContactInformationContent {...props}/>);
    wrapper = wrapper.find('LoadingSection').dive();

    expect(wrapper.find('ContactError')).to.have.lengthOf(1);

    wrapper = wrapper.find('ContactError').dive();
    wrapper = wrapper.find('AlertBox').dive();

    expect(wrapper.text()).to.contain('Contact information is coming soon');
  });

});
