import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import VetTecVeteranPrograms from '../../../components/vet-tec/VetTecVeteranPrograms';

const institution = {
  facilityCode: '2V000105',
  city: 'LOS ANGELES',
  state: 'CA',
  zip: '90045',
  country: 'USA',
  facilityMap: {
    main: {
      institution: {},
    },
  },
  address1: 'address 1',
  address2: 'address 2',
  address3: 'address 3',
  physicalAddress1: '6060 CENTER DRIVE #950',
  physicalAddress2: 'Address line 2',
  physicalAddress3: 'Address line 3',
  programs: [
    {
      description: 'Program Name',
      schoolLocale: 'City',
      providerWebsite: 'https://galvanize.edu',
      phoneAreaCode: '843',
      phoneNumber: '333-3333',
      available: true,
      studentVetGroup: true,
      vetSuccessEmail: 'vetsuccess@example.com',
      vetSuccessName: 'Vet Success',
      studentVetGroupWebsite: 'http://studentvetgroup.com',
    },
  ],
};
describe('<VetTecVeteranPrograms/>', () => {
  it('should render', () => {
    const onShowModalSpy = sinon.spy();
    const wrapper = shallow(
      <VetTecVeteranPrograms
        institution={institution}
        onShowModal={onShowModalSpy}
        programs={institution.programs}
      />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('calls onShowModal when LearnMoreLabel is clicked', () => {
    const onShowModalSpy = sinon.spy();
    const wrapper = shallow(
      <VetTecVeteranPrograms
        institution={institution}
        onShowModal={onShowModalSpy}
      />,
    );
    wrapper
      .find('LearnMoreLabel')
      .first()
      .simulate('click');
    expect(onShowModalSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('renders the info paragraph when there are no available programs', () => {
    const wrapper = shallow(
      <VetTecVeteranPrograms institution={{ programs: [{}] }} />,
    );
    expect(wrapper.find('p').text()).to.equal(
      'Please contact the school or their military office directly for information on the Veteran programs they offer.',
    );
    wrapper.unmount();
  });
  it('does not render the link if program is not available', () => {
    const institutions = { programs: [{ studentVetGroup: false }] };
    const wrapper = shallow(
      <VetTecVeteranPrograms institution={institutions} />,
    );
    expect(wrapper.find('a').exists()).to.be.false;
    wrapper.unmount();
  });
  it('renders the link if program is available and has a link', () => {
    const institutions = {
      programs: [
        { studentVetGroup: true, studentVetGroupWebsite: 'http://example.com' },
      ],
    };
    const wrapper = shallow(
      <VetTecVeteranPrograms
        institution={institutions}
        onShowModal={() => {}}
      />,
    );
    expect(wrapper.find('a').exists()).to.be.true;
    wrapper.unmount();
  });
  it('does not render the va-icon#close icon when a program is not available', () => {
    const institutions = { programs: [{ studentVetGroup: false }] };
    const wrapper = shallow(
      <VetTecVeteranPrograms
        institution={institutions}
        onShowModal={() => {}}
      />,
    );
    expect(wrapper.find('va-icon#close').exists()).to.be.false;
    wrapper.unmount();
  });
  it('renders va-icon#checkIcon when a program is available', () => {
    const institutions = { programs: [{ studentVetGroup: true }] };
    const wrapper = shallow(
      <VetTecVeteranPrograms
        institution={institutions}
        onShowModal={() => {}}
      />,
    );
    expect(wrapper.find('va-icon#checkIcon').exists()).to.be.true;
    wrapper.unmount();
  });
});
