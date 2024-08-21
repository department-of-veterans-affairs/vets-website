import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import VeteranProgramsAndSupport from '../../../components/profile/VeteranProgramsAndSupport';

describe('<VeteranProgramsAndSupport>', () => {
  it('should render', () => {
    const tree = shallow(
      <VeteranProgramsAndSupport institution={{}} constants={{}} />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should Renders the Veteran Programs when available', () => {
    const showModalMock = sinon.spy();
    const ariaLabels = {
      learnMore: {
        eightKeys: 'Learn more about 8 Keys to Success',
        TuitionAssistance: 'Learn more about Military Tuition Assistance (TA)',
      },
    };
    const props = {
      showModal: showModalMock,
      ariaLabels,
      institution: {
        vetSuccessEmail: 'someEmail@email.com',
        vetSuccessName: 'someName',
      },
      constants: {},
    };
    const programs = {
      eightKeys: {
        modal: 'eightKeys',
        text: '8 Keys to Veteran Success',
        link: false,
        ariaLabel: ariaLabels.learnMore.eightKeys,
      },
      dodmou: {
        modal: 'ta',
        text: 'Military Tuition Assistance (TA)',
        link: false,
        ariaLabel: ariaLabels.learnMore.militaryTuitionAssistance,
      },
      poe: {
        modal: 'poe',
        text: 'Principles of Excellence',
        link: false,
        ariaLabel: ariaLabels.learnMore.principlesOfExcellence,
      },
      studentVeteran: {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: props.institution.studentVeteranLink,
          text: 'Visit the site',
        },
        ariaLabel: ariaLabels.learnMore.studentVeteranGroup,
      },
      vetSuccessName: {
        modal: 'vsoc',
        text: 'VetSuccess on Campus',
        link: {
          href:
            props.institution.vetSuccessEmail &&
            `mailto:${props.institution.vetSuccessEmail}`,
          text: `Email ${props.institution.vetSuccessName}`,
        },
        ariaLabel: ariaLabels.learnMore.vetSuccess,
      },
    };
    const isSomething = {
      eightKeys: true,
      dodmou: true,
    };
    const createId = text => `id_${text.replace(/\s+/g, '_').toLowerCase()}`;
    const wrapper = shallow(<VeteranProgramsAndSupport {...props} />);
    wrapper.setProps({
      programs,
      createId,
      showModal: showModalMock,
      isSomething,
    });
    const veteranProgramsSection = wrapper.find('.usa-width-one-half');
    expect(veteranProgramsSection).to.have.lengthOf(2);
    expect(
      veteranProgramsSection
        .find('h3')
        .first()
        .text(),
    ).to.equal('Veteran Programs');

    const learnMoreLabels = veteranProgramsSection.find('LearnMoreLabel');
    expect(learnMoreLabels).to.have.lengthOf(
      Object.keys(isSomething).length - 1,
    );
    const firstLearnMoreLabel = learnMoreLabels.first();
    firstLearnMoreLabel.props().onClick();
    expect(showModalMock.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('should hide Yellow Ribbon ROW from the table when type is "Flight', () => {
    const tree = shallow(
      <VeteranProgramsAndSupport
        institution={{ type: 'FLIGHT' }}
        constants={{}}
      />,
    );
    expect(tree.find('va-table-row').at(2)).to.have.lengthOf(0);
    tree.unmount();
  });
  it('should show Yellow Ribbon ROW from the table when type is not "Flight', () => {
    const tree = shallow(
      <VeteranProgramsAndSupport
        institution={{ type: 'PUBLIC' }}
        constants={{}}
      />,
    );
    expect(tree.find('va-table-row').at(2)).to.have.lengthOf(1);
    tree.unmount();
  });
});
