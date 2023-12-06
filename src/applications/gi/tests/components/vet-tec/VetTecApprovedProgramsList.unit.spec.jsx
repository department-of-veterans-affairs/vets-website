import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import VetTecApprovedProgramsList from '../../../components/vet-tec/VetTecApprovedProgramsList';

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
    },
  ],
};
describe('<VetTecApprovedProgramsList/>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecApprovedProgramsList
        institution={institution}
        programs={institution.programs}
      />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('renders without crashing', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const wrapper = shallow(<VetTecApprovedProgramsList programs={programs} />);
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('displays program descriptions', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const wrapper = shallow(<VetTecApprovedProgramsList programs={programs} />);
    expect(wrapper.find('.program-description')).to.have.lengthOf(
      programs.length,
    );
    wrapper.unmount();
  });

  it('displays program lengths', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const wrapper = shallow(<VetTecApprovedProgramsList programs={programs} />);
    expect(wrapper.find('.program-length')).to.have.lengthOf(programs.length);
    wrapper.unmount();
  });

  it('displays program tuitions', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const wrapper = shallow(<VetTecApprovedProgramsList programs={programs} />);
    expect(wrapper.find('.program-tuition')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('displays the "View all" button when more than 5 programs are available', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const wrapper = shallow(<VetTecApprovedProgramsList programs={programs} />);
    expect(wrapper.find('.view-all-button')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('displays the "Show next" button when more programs are available', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const morePrograms = [
      ...programs,
      {
        description: 'Program 3',
        lengthInHours: '60',
        tuitionAmount: '1500',
      },
    ];
    const wrapper = shallow(
      <VetTecApprovedProgramsList programs={morePrograms} />,
    );
    expect(wrapper.find('.show-more-button')).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('scrolls to the accordion element and focuses the button', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];
    const morePrograms = [
      ...programs,
      {
        description: 'Program 3',
        lengthInHours: '60',
        tuitionAmount: '1500',
      },
    ];
    const scrollIntoViewSpy = sinon.spy();

    const fakeElement = {
      id: 'Approved programs-accordion',
      scrollIntoView: scrollIntoViewSpy,
    };

    const originalGetElementById = document.getElementById;
    document.getElementById = () => fakeElement;

    const wrapper = shallow(
      <VetTecApprovedProgramsList programs={morePrograms} />,
    );

    wrapper.instance().handleAccordionFocus();

    expect(scrollIntoViewSpy.calledOnce).to.be.true;
    document.getElementById = originalGetElementById;
    wrapper.unmount();
  });

  it('should update state and call handleShowMoreClicked and handleViewAllClicked', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];

    const wrapper = shallow(
      <VetTecApprovedProgramsList programs={programs} viewAll />,
    );
    const instance = wrapper.instance();

    instance.handleShowMoreClicked = sinon.spy();
    instance.handleViewAllClicked = sinon.spy();

    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    expect(instance.state.viewAll).to.equal(true);
    expect(instance.state.displayAmount).to.equal(programs.length);

    expect(instance.handleShowMoreClicked.calledOnce).to.be.false;
    wrapper.find('button').simulate('click');
    expect(instance.state.viewAll).to.equal(false);
    expect(instance.state.displayAmount).to.equal(5);
    expect(instance.handleViewAllClicked.calledOnce).to.be.false;
    wrapper.unmount();
  });

  it('should render "Show next" and "View all" buttons', () => {
    const programs = [
      {
        description: 'Program 1',
        lengthInHours: '40',
        tuitionAmount: '1000',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
      {
        description: 'Program 2',
        lengthInHours: '50',
        tuitionAmount: '1200',
      },
    ];

    const wrapper = shallow(
      <VetTecApprovedProgramsList programs={programs} viewAll />,
    );

    expect(wrapper.find('button')).to.have.lengthOf(2);
    expect(wrapper.find('button')).to.have.lengthOf(2);
    wrapper.unmount();
  });
});
