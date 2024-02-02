import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';
import { mockModalProfileData } from '../helpers';

import { Modals } from '../../containers/Modals';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<Modals>', () => {
  it('should render', () => {
    const wrapper = shallow(<Modals {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  describe('Retention modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'retention',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The share of first-time, full-time undergraduates',
      );
      wrapper.unmount();
    });
  });

  describe('Gradrates modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'gradrates',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The graduation rate after six years for schools that mostly award four-year degrees',
      );
      wrapper.unmount();
    });
  });

  describe('Salaries modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'salaries',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The median earnings of former students who received federal financial aid',
      );
      wrapper.unmount();
    });
  });

  describe('Repayment modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'repayment',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The share of students who have repaid at least $1 of',
      );
      wrapper.unmount();
    });
  });

  describe('Preferred Providers modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'preferredProviders',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Preferred training providers');
      wrapper.unmount();
    });
  });

  describe('Tuition and Fees modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'tuitionAndFees',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Tuition and fees');
      wrapper.unmount();
    });
  });

  describe('scholarships modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'scholarships',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Are you receiving any scholarships or grants that go directly to pay',
      );
      wrapper.unmount();
    });
  });

  describe('Pay to Provider modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'payToProvider',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'To help ensure that Veterans find jobs, VA pays VET TEC',
      );
      wrapper.unmount();
    });
  });

  describe('Housing Allowance modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'housingAllowance',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'If you attend your training program in person',
      );
      wrapper.unmount();
    });
  });

  describe('GI Bill students modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'gibillstudents',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('GI Bill students');
      wrapper.unmount();
    });
  });

  describe('Student Veteran group modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'vetgroups',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Student Veteran group');
      wrapper.unmount();
    });
  });

  describe('Yellow Ribbon Program modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'yribbon',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Yellow Ribbon Program');
      wrapper.unmount();
    });
  });

  describe('Student complaints modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'studentComplaints',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'This is the number of closed, Principles of Excellence-related, complaints',
      );
      wrapper.unmount();
    });
  });

  describe('VA Complaints modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'allCampuses',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('VA Complaints (all campuses):');
      wrapper.unmount();
    });
  });

  describe('Principles of Excellence modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'poe',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Principles of Excellence');
      wrapper.unmount();
    });
  });

  describe('Military Tuition Assistance modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'ta',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Military Tuition Assistance (TA)');
      wrapper.unmount();
    });
  });

  describe('Military Tuition Assistance modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'ta',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Military Tuition Assistance (TA)');
      wrapper.unmount();
    });
  });

  describe('Priority Enrollment modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'priorityEnrollment',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'If a college or university has a system for priority enrollment',
      );
      wrapper.unmount();
    });
  });

  describe('Online Only Distance Learning modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'onlineOnlyDistanceLearning',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Your housing allowance is determined by where you take classes',
      );
      wrapper.unmount();
    });
  });

  describe('Tuition and Fees School modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'tuitionAndFeesSchool',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'We display the average tuition and fees for an undergraduate student',
      );
      wrapper.unmount();
    });
  });

  describe('Housing Allowance School modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'housingAllowanceSchool',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Your housing allowance is determined by where you take classes',
      );
      wrapper.unmount();
    });
  });

  describe('Housing allowance OJT modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'housingAllowanceOJT',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Your housing allowance is determined by where you take training',
      );
      wrapper.unmount();
    });
  });

  describe('Eight Keys modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'eightKeys',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('8 Keys to Veteran Success');
      wrapper.unmount();
    });
  });

  describe('Veterans Success modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'vsoc',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('VetSuccess on Campus (VSOC)');
      wrapper.unmount();
    });
  });

  describe('Accredited modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'accredited',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The goal of accreditation is to ensure that the education',
      );
      wrapper.unmount();
    });
  });

  describe('Accreditation types modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'typeAccredited',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Accreditation types (regional vs. national vs. hybrid)',
      );
      wrapper.unmount();
    });
  });

  describe('Accreditation modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'accreditation',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The goal of accreditation is to ensure the education provided',
      );
      wrapper.unmount();
    });
  });

  describe('Single Contact modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'singleContact',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Single point of contact for Veterans');
      wrapper.unmount();
    });
  });

  describe('Credit for military training modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'militaryTrainingCredit',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Credit for military training');
      wrapper.unmount();
    });
  });

  describe('Independent Study modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'independentStudy',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Beneficiaries may use educational assistance to access online learning',
      );
      wrapper.unmount();
    });
  });

  describe('Section 103 modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'section103',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Protection against late VA payments');
      wrapper.unmount();
    });

    it('should track link click', () => {
      const wrapper = mount(<Modals {...props} />);
      const anchorText =
        'Read our policy on protecting students from late VA payments';
      const [anchor] = Array.from(wrapper.find('a')).filter(a =>
        a.props.children.toString().startsWith(anchorText),
      );
      anchor.props.onClick();
      const recordedEvent = global.window.dataLayer[0];
      expect(recordedEvent.event).to.eq('gibct-modal-link-click');
      wrapper.unmount();
    });
  });

  describe('VRRAP modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'vrrap',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Veteran Rapid Retraining Assistance Program (VRRAP)',
      );
      wrapper.unmount();
    });
  });

  describe('Caution info modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'cautionInfo',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Learn more about these warnings');
      wrapper.unmount();
    });
  });

  describe('Calculate tuition and fees modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcTuition',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Tuition and fees per year');
      wrapper.unmount();
    });
  });

  describe('Calculate In-State tuition and fees modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcInStateTuition',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('In-state tuition and fees per year');
      wrapper.unmount();
    });
  });

  describe('Calculate Yellow Ribbon modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcYr',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The Yellow Ribbon Program can help you pay for out-of-state',
      );
      wrapper.unmount();
    });
  });

  describe('When Used modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'whenUsedGiBill',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'What is Section 501 (Monthly Housing Allowance Rate)?',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate Scholarships modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcScholarships',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Are you receiving any scholarships or grants that go directly to pay tuition/fees this year?',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate based on TA modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcTuitionAssist',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Are you receiving any military tuition assistance this year? If so, how much?',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate based on how you are enrolled modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcEnrolled',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Are you considered a full-time or part-time student',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate based on school calendar modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcSchoolCalendar',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Is your school on a semester, quarter, or non-traditional calendar system?',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate based on kicker modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcKicker',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'A kicker bonus (also known as the “College Fund”)',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate based on Beneficiary Location modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcBeneficiaryLocationQuestion',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'VA pays monthly housing allowance (MHA) based on the campus location where you physically attend the majority of your classes.',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate Working Hours modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'calcWorking',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'How many hours per week will you be working on your OJT',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate In-State modal without link', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'inStateWithoutLink',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Contact the School Certifying Official (SCO) to learn more',
      );
      wrapper.unmount();
    });
  });

  describe('Calculate In-State modal with link', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'inStateWithLink',
      },
      profile: { ...mockModalProfileData },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'see any in-state tuition requirements.',
      );
      wrapper.unmount();
    });
  });

  describe('Facility Code modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'facilityCode',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Unique identifier for VA-approved facilities',
      );
      wrapper.unmount();
    });
  });

  describe('IPEDS modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'ipedsCode',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Unique identification number assigned to postsecondary institutions',
      );
      wrapper.unmount();
    });
  });

  describe('OPE Code modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'opeCode',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Identification number used by the U.S. Department of Education’s Office of Postsecondary Education (OPE)',
      );
      wrapper.unmount();
    });
  });

  describe('GI Bill Benefit chapters modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'giBillChapter',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Which GI Bill benefit do you want to use?',
      );
      wrapper.unmount();
    });
  });

  describe('Book Stipend Info modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'bookStipendInfo',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'You may be eligible for money to cover books and supplies',
      );
      wrapper.unmount();
    });
  });

  describe('VETTEC modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'vetTec',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Veteran Employment Through Technology Education Courses',
      );
      wrapper.unmount();
    });
  });

  describe('Cummulative Service modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'cumulativeService',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Cumulative Post-9/11 service');
      wrapper.unmount();
    });
  });

  describe('Comparison Limit modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'comparisonLimit',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('You’ve reached the comparison limit');
      wrapper.unmount();
    });
  });

  describe('Enlistment Service modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'enlistmentService',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Completed an enlistment of (MGIB):');
      wrapper.unmount();
    });
  });

  describe('Consecutive Service modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'consecutiveService',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Length of longest active duty tour (REAP)',
      );
      wrapper.unmount();
    });
  });

  describe('Preferred training providers modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'preferredProvider',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Preferred training providers');
      wrapper.unmount();
    });
  });

  describe('Cautionary Warnings modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'cautionaryWarnings',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Cautionary warnings and school closings',
      );
      wrapper.unmount();
    });
  });

  describe('Size of Instituion modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'sizeOfInstitution',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'The size of institutions is based on calculation of full-time equivalent',
      );
      wrapper.unmount();
    });
  });

  describe('Specialized Mission modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'specializedMission',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Is the school single-gender, a Historically Black college or university, or does it have a religious affiliation?',
      );
      wrapper.unmount();
    });
  });

  describe('Caution Flags modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'cautionFlags',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain(
        'Caution flags indicate that VA or other federal agencies like the',
      );
      wrapper.unmount();
    });
  });
});
