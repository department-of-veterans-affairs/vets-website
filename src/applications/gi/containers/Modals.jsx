import React from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import * as actions from '../actions';
import AccreditationModalContent from '../components/content/modals/AccreditationModalContent';
import AllCampusesModalContent from '../components/content/modals/AllCampusesModalContent';
import BookStipendInfoModalContent from '../components/content/modals/BookStipendInfoModalContent';
import CalcBeneficiaryLocationQuestionModalContent from '../components/content/modals/CalcBeneficiaryLocationQuestionModalContent';
import CautionFlagsModalContent from '../components/content/modals/CautionFlagsModalContent';
import EightKeysModalContent from '../components/content/modals/EightKeysModalContent';
import FacilityCodeModalContent from '../components/content/modals/FacilityCodeModalContent';
import GiBillStudentsModalContent from '../components/content/modals/GiBillStudentsModalContent';
import HousingAllowanceOJTModalConent from '../components/content/modals/HousingAllowanceOJTModalContent';
import HousingAllowanceSchoolModalContent from '../components/content/modals/HousingAllowanceSchoolModalContent';
import IndependentStudyModalContent from '../components/content/modals/IndependentStudyModalContent';
import IpedsCodeModalContent from '../components/content/modals/IpedsCodeModalContent';
import MilitaryTrainingCreditModalContent from '../components/content/modals/MilitaryTrainingCreditModalContent';
import MilitaryTuitionAssistanceModalContent from '../components/content/modals/MilitaryTuitionAssistanceModalContent';
import OpeCodeModalContent from '../components/content/modals/OpeCodeModalContent';
import PrinciplesOfExcellenceModalContent from '../components/content/modals/PrinciplesOfExcellenceModalContent';
import PriorityEnrollmentModalContent from '../components/content/modals/PriorityEnrollmentModalContent';
import SingleContactModalContent from '../components/content/modals/SingleContactModalContent';
import SizeOfInstitutionsModalContent from '../components/content/modals/SizeOfInstitutionsModalContent';
import SpecializedMissionModalContent from '../components/content/modals/SpecializedMissionModalContent';
import StudentComplaintsModalContent from '../components/content/modals/StudentComplaintsModalContent';
import StudentVeteranGroupModalContent from '../components/content/modals/StudentVeteranGroupModalContent';
import TuitionAndFeesModalContent from '../components/content/modals/TuitionAndFeesModalContent';
import VeteranSuccessModalContent from '../components/content/modals/VeteranSuccessModalContent';
import YellowRibbonModalContent from '../components/content/modals/YellowRibbonModalContent';

export function Modals({ hideModal, modals, profile }) {
  const shouldDisplayModal = modal => modals.displaying === modal;

  const renderProfilePageModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('retention')}
        modalTitle="Retention rate"
      >
        <p>
          The share of first-time, full-time undergraduates who returned to the
          institution after their freshman year.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('gradrates')}
        modalTitle="Graduation rate"
      >
        <p>
          The graduation rate after six years for schools that mostly award
          four-year degrees and after four years for all other schools. These
          rates are only for full-time students enrolled for the first time.
        </p>
        <p>
          Student Veteran graduation rates measure full-time Post-9/11 GI Bill
          student’s graduation reported within the VA system while the student
          is using benefits.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('salaries')}
        modalTitle="Average salaries"
      >
        <p>
          The median earnings of former students who received federal financial
          aid, 10 years after they started school.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('repayment')}
        modalTitle="Repayment rate"
      >
        <p>
          The share of students who have repaid at least $1 of the principal
          balance on their federal loans within 3 years of leaving school.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('preferredProviders')}
        modalTitle="Preferred training providers"
      >
        <p>
          A provider is “preferred” if the training facility agrees to refund
          tuition and fees to VA if the student completes the program and
          doesn’t find meaningful employment within 180 days.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('tuitionAndFees')}
        modalTitle="Tuition and fees"
      >
        <p>
          VA pays all tuition and fees for the VET TEC program directly to the
          training provider.
        </p>
        <p>
          If you’re participating in a VET TEC program, you’ll have the same
          annual tuition and fees cap as students attending a private
          institution under the Post-9/11 GI Bill. If your tuition and fees
          exceed that cap, you’ll be responsible for paying those.
        </p>
        <p>
          Preferred Provider training programs aren’t subject to a cap on
          tuition and fees.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('scholarships')}
        modalTitle="Scholarships"
      >
        <p>
          Are you receiving any scholarships or grants that go directly to pay
          your tuition or fees for this program? If so, add that number here.
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('payToProvider')}
        modalTitle="VA pays to provider"
      >
        <p>
          To help ensure that Veterans find jobs, VA pays VET TEC training
          providers in three installments based on the progress and success of
          their Veteran students.
        </p>
        <div>
          Training providers receive:
          <ul>
            <li>
              An initial 25 percent of tuition and fees when the Veteran enrolls
              and begins attending the program{' '}
            </li>
            <li>
              Another 25 percent when the Veteran completes their training
            </li>
            <li>
              The remaining 50 percent once the Veteran secures meaningful
              employment in their field of study
            </li>
          </ul>
        </div>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('housingAllowance')}
        modalTitle="Housing allowance"
      >
        <p>
          If you attend your training program in person, your housing stipend
          will be equal to the monthly military Basic Allowance for Housing
          (BAH) for an E-5 with dependents. This is based on the postal code
          where you attend your training.
        </p>
        <p>
          If you participate in an online program, your stipend will be half of
          the BAH national average for an E-5 with dependents.
        </p>
        <p>
          <strong>Note:</strong> If you don’t attend a training for a full
          month, we’ll prorate your housing payment for the days you train.
        </p>
      </VaModal>
    </span>
  );

  const renderProfileSchoolHeaderModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('gibillstudents')}
        modalTitle="GI Bill students"
        large
      >
        <GiBillStudentsModalContent />
      </VaModal>
    </span>
  );

  const renderProfileVeteranSummaryModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('vetgroups')}
        modalTitle="Student Veteran group"
        large
      >
        <StudentVeteranGroupModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('yribbon')}
        modalTitle="Yellow Ribbon Program"
        large
      >
        <YellowRibbonModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('studentComplaints')}
        modalTitle="Student complaints"
      >
        <StudentComplaintsModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('allCampuses')}
      >
        <AllCampusesModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('poe')}
        modalTitle="VA Complaints (all campuses)"
        large
      >
        <PrinciplesOfExcellenceModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('ta')}
        modalTitle="Military Tuition Assistance (TA)"
      >
        <MilitaryTuitionAssistanceModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('priorityEnrollment')}
        modalTitle="Priority enrollment"
      >
        <PriorityEnrollmentModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('onlineOnlyDistanceLearning')}
        modalTitle="Your housing allowance is determined by where you take classes"
        large
      >
        <div>
          <p>
            <p>
              Under the GI Bill you’re eligible to receive a monthly housing
              allowance. We calculate this monthly housing allowance based on
              where you take classes.
            </p>
            <p>
              If you use Post-9/11 GI Bill benefits to take at least 1 in-person
              class, your housing allowance is based on where you do most of
              your coursework. If you take online courses only, your housing
              allowance is based on 50% of the national average.
            </p>
            <p>
              Through Dec. 21, 2021, current and new students can receive
              in-person allowance rates if their school’s approved program
              changed from in-person to online learning due to COVID-19.
            </p>
            <a href="https://www.benefits.va.gov/gibill/resources/benefits_resources/rate_tables.asp?_ga=2.144591223.39405460.1542131207-1582256389.1508352376">
              View the current housing allowance payment rates
            </a>
          </p>
        </div>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('tuitionAndFeesSchool')}
        modalTitle="Tuition and fees per year"
      >
        <TuitionAndFeesModalContent />
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('housingAllowanceSchool')}
        modalTitle="Your housing allowance is determined by where you take classes"
        large
      >
        <HousingAllowanceSchoolModalContent />
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('housingAllowanceOJT')}
        modalTitle="Your housing allowance is determined by where you take training"
      >
        <HousingAllowanceOJTModalConent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('eightKeys')}
        modalTitle="8 Keys to Veteran Success"
        large
      >
        <EightKeysModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('vsoc')}
        modalTitle="VetSuccess on Campus (VSOC)"
      >
        <VeteranSuccessModalContent />
      </VaModal>
    </span>
  );

  const renderProfileSummaryModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('accredited')}
        modalTitle="Accreditation and why it matters"
        large
      >
        <p>
          The goal of accreditation is to ensure that the education provided by
          institutions of higher education meets acceptable levels of quality.
          Schools can be accredited by private educational associations of
          regional or national scope.
        </p>
        <p>
          Accreditation matters if you plan to start school at one institution
          and transfer to another to complete your degree. Be sure to ask any
          potential school about their credit transfer policy.
        </p>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('typeAccredited')}
        modalTitle="Accreditation types (regional vs. national vs. hybrid)"
        large
      >
        <p>
          Is the school regionally or nationally accredited at the institution
          level?
        </p>
        <p>
          Schools are accredited by private educational associations of regional
          or national scope. While the Department of Education does not say
          whether regional or national accreditation is better, a recent ED
          study revealed that, “Nearly 90 percent of all student credit transfer
          opportunities occurred between institutions that were regionally,
          rather than nationally, accredited.”{' '}
          <a href="http://nces.ed.gov/pubs2014/2014163.pdf" id="anch_386">
            http://nces.ed.gov/pubs2014/2014163.pdf
          </a>
        </p>
        <p>
          CAUTION: Not every program approved for GI Bill benefits at an
          accredited school is accredited by the regional or national
          accreditor. Prior to enrolling, it’s important you confirm the program
          you’re seeking is accredited and whether or not your field of study
          requires accreditation for employment and/or licensing.
        </p>
        <p>
          To learn more about accreditation types, visit the{' '}
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#accreditation_type"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            about this tool
          </a>{' '}
          page.{' '}
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('accreditation')}
        modalTitle="Accreditation and why it matters"
      >
        <AccreditationModalContent />
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('singleContact')}
        modalTitle="Single point of contact for Veterans"
        large
      >
        <SingleContactModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('militaryTrainingCredit')}
        modalTitle="Credit for military training"
      >
        <MilitaryTrainingCreditModalContent />
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('independentStudy')}
        modalTitle="Independent study"
        large
      >
        <IndependentStudyModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('section103')}
        modalTitle="Protection against late VA payments"
        large
      >
        <p>
          If VA is late making a tuition payment to a GI Bill school, the school
          can’t prevent a GI Bill student from attending classes or accessing
          school facilities.
        </p>
        <p>
          Schools may require students to provide proof of their GI Bill
          eligibility in the form of:
        </p>
        <ul>
          <li>
            Certificate of Eligibility (COE) <strong>or</strong>
          </li>
          <li>
            Certificate of Eligibility (COE) and additional criteria like an
            award letter or other documents the school specifies
          </li>
        </ul>
        <p>
          <strong>
            In addition, schools can’t charge late fees or otherwise penalize GI
            Bill students if VA is late making a tuition and/or fees payment.
          </strong>{' '}
          This restriction on penalties doesn’t apply if the student owes
          additional fees to the school beyond the tuition and fees that VA
          pays. Students are protected from these penalties for up to 90 days
          from the beginning of the term.
        </p>
        <p>
          Contact the School Certifying Official (SCO) to learn more about the
          school’s policy.{' '}
          <a
            href="https://benefits.va.gov/gibill/fgib/transition_act.asp"
            onClick={() => {
              recordEvent({
                event: 'gibct-modal-link-click',
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our policy on protecting students from late VA payments
          </a>
          .
        </p>
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('vrrap')}
        modalTitle="Veteran Rapid Retraining Assistance Program (VRRAP)"
        large
      >
        <p>
          The Veteran Rapid Retraining Assistance Program (VRRAP) offers
          education and training for high-demand jobs to Veterans who are
          unemployed because of the COVID-19 pandemic.
        </p>
        <p>
          To learn more about this benefit and see eligibility requirements,{' '}
          <a href="https://www.va.gov/education/other-va-education-benefits/veteran-rapid-retraining-assistance/">
            visit the VRRAP page
          </a>
          .
        </p>
      </VaModal>
    </span>
  );

  const renderProfileHistoryModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('facilityCode')}
        modalTitle="VA facility code"
      >
        <FacilityCodeModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('ipedsCode')}
        modalTitle="ED IPEDS code"
      >
        <IpedsCodeModalContent />
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('opeCode')}
        modalTitle="ED OPE code"
      >
        <OpeCodeModalContent />
      </VaModal>
    </span>
  );

  const renderProfileCautionFlagModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('cautionInfo')}
        modalTitle="Learn more about these warnings"
      >
        <p>
          These are indicators VA has determined potential students should pay
          attention to and consider before enrolling in this program. A caution
          flag means VA or other federal agencies like the Department of
          Education or Department of Defense have applied increased regulatory
          or legal scrutiny to this program. VA will display other categories of
          caution flags in future versions of the GI Bill Comparison Tool.
        </p>
        <p>
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#suspension"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suspension of VA Benefits to Five Schools for Deceptive Practices
          </a>
        </p>

        <p>
          <a
            href="https://studentaid.ed.gov/sa/about/data-center/school/hcm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Heightened Cash Monitoring
          </a>
        </p>
        <p>
          <a
            href="http://ope.ed.gov/accreditation/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accreditation
          </a>
        </p>
        <p>
          <a
            href="https://www.dodmou.com/Home/Faq"
            target="_blank"
            rel="noopener noreferrer"
          >
            DoD Probation for Military Tuition Assistance
          </a>
        </p>
        <p>
          <a
            href="https://www.ftc.gov/news-events/press-releases/2016/01/ftc-brings-enforcement-action-against-devry-university"
            target="_blank"
            rel="noopener noreferrer"
          >
            Federal Trade Commission Filed Suit for Deceptive Advertising
          </a>
        </p>
        <p>
          <a
            href="http://www.justice.gov/opa/pr/profit-college-company-pay-955-million-settle-claims-illegal-recruiting-consumer-fraud-and"
            target="_blank"
            rel="noopener noreferrer"
          >
            Settlement reached with the Federal Trade Commission (FTC)
          </a>
        </p>
        <p>
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#caution"
            target="_blank"
            rel="noopener noreferrer"
          >
            Suspended for 85/15 violation – Flight Program
          </a>
        </p>
        <p>
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#caution"
            target="_blank"
            rel="noopener noreferrer"
          >
            Denial of Recertification Application to Participate in the Federal
            Student Financial Assistance Programs
          </a>
        </p>
        <p>
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#ACICS"
            target="_blank"
            rel="noopener noreferrer"
          >
            School operating under provisional accreditation (previously
            accredited by ACICS)
          </a>
        </p>
        <p>
          To learn more, visit the "Caution Flag" section of the{' '}
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#caution"
            target="_blank"
            rel="noopener noreferrer"
          >
            "About this tool"
          </a>{' '}
          page.
        </p>
      </VaModal>
    </span>
  );

  const renderProfileCalculatorModals = () => {
    const whenUsedGiBill = (
      <div>
        <p>
          Effective January 1, 2018, the Post-9/11 GI Bill monthly housing
          allowance rate will be the same as the Department of Defense’s E-5
          with dependents Basic Allowance Housing (BAH) rate.
        </p>
        <ul>
          <li>
            Students will receive this rate if they first used their Post-9/11
            GI Bill benefits on or after January 1, 2018.
          </li>
          <li>
            If the student started using their Post-9/11 GI Bill before January
            1, 2018, they will continue receiving payments based on the slightly
            higher VA rate eliminated by this change.
          </li>
        </ul>
      </div>
    );

    const inStateTuitionInformation = profile.attributes.inStateTuitionInformation?.startsWith(
      'http',
    )
      ? profile.attributes.inStateTuitionInformation
      : `http://${profile.attributes.inStateTuitionInformation}`;

    return (
      <span>
        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcTuition')}
          modalTitle="Tuition and fees per year"
        >
          <p>
            Enter the total tuition/fees you’ll be charged for the academic
            year.
          </p>
          <p>
            When you select some schools, we import the average tuition/fees for
            an undergraduate student as reported by the school to the Department
            of Education through{' '}
            <a
              href="http://nces.ed.gov/ipeds/datacenter/"
              id="anch_442"
              target="blank"
              rel="noopener noreferrer"
            >
              IPEDS
            </a>
            . This is the same information that is published on{' '}
            <a
              href="http://nces.ed.gov/collegenavigator/"
              id="anch_443"
              target="blank"
              rel="noopener noreferrer"
            >
              College Navigator
            </a>
            .
          </p>
          <p>
            To learn more, please review our "
            <a
              href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#yellow_ribbon_from_school"
              target="_blank"
              rel="noopener noreferrer"
            >
              About this tool
            </a>
            " page.
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcInStateTuition')}
          Your
          housing
          allowance
          is
          determined
          by
          where
          you
          take
          classes
          modalTitle="In-state tuition and fees per year"
          large
        >
          <p>
            Enter the amount of tuition/fees your school charges in-state
            students.
          </p>
          <p>
            When you select some schools, we import the average in-state
            tuition/fees for an undergraduate student as reported by the school
            to the Department of Education through IPEDS. This is the same
            information that is published on College Navigator.
          </p>
          <p>
            Generally, in-state residents are charged a discounted rate of
            tuition and fees. VA pays the in-state tuition & fee rate at public
            schools.{' '}
            <a
              href="https://www.benefits.va.gov/gibill/resources/benefits_resources/rate_tables.asp#ch33#TUITION"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here for more information
            </a>
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcYr')}
        >
          <YellowRibbonModalContent />
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('whenUsedGiBill')}
          modalTitle="What is Section 501 (Monthly Housing Allowance Rate)?"
        >
          {whenUsedGiBill}
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcScholarships')}
          modalTitle="Scholarships (excluding Pell Grants)"
        >
          <p>
            Are you receiving any scholarships or grants that go directly to pay
            tuition/fees this year? If so, add that number here.
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcTuitionAssist')}
          modalTitle="Military Tuition Assistance (TA)"
        >
          <p>
            Are you receiving any military tuition assistance this year? If so,
            how much?
          </p>
          <p>
            The Post-9/11 GI Bill pays the net-cost of your education after
            scholarships or financial aid amounts are applied. This includes
            amounts already paid by military tuition assistance.
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcEnrolled')}
          modalTitle="Enrollment status"
        >
          <div>
            {' '}
            <p>
              Are you considered a full-time or part-time student by your
              school? Students attending school less than full-time will get a
              pro-rated monthly housing allowance. Students attending school
              exactly ½ time or less won’t get a monthly housing allowance.
            </p>
          </div>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcSchoolCalendar')}
          modalTitle="School calendar"
        >
          <p>
            Is your school on a semester, quarter, or non-traditional calendar
            system?
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcKicker')}
          modalTitle="Eligible for kicker bonus?"
        >
          <div>
            {' '}
            <p>
              A kicker bonus (also known as the “College Fund”) is an additional
              incentive paid by an individual’s branch of service. The kicker
              bonus may be offered to extend a tour of duty, retain
              highly-skilled military personnel, or for other reasons the branch
              of service determines. The money is on top of any GI Bill payments
              paid directly to the Veteran.
            </p>
          </div>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcBeneficiaryLocationQuestion')}
          modalTitle="Location where you'll take classes"
          large
        >
          <CalcBeneficiaryLocationQuestionModalContent />
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('calcWorking')}
          modalTitle="Will be working"
        >
          <p>
            How many hours per week will you be working on your OJT /
            Apprenticeship? Beneficiaries working less than 120 hours/month (or
            approximately 30 hours/week) receive a prorated monthly housing
            allowance.
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('inStateWithoutLink')}
          modalTitle="Qualifying for in-state tuition"
        >
          <p>
            If you’re using GI Bill education benefits, you probably qualify for
            in-state tuition.
          </p>
          <p>
            Contact the School Certifying Official (SCO) to learn more about
            this school’s in-state tuition requirements.
          </p>
        </VaModal>

        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('inStateWithLink')}
          modalTitle="Qualifying for in-state tuition"
        >
          <p>
            If you’re using GI Bill education benefits, you probably qualify for
            in-state tuition.
          </p>
          <p>
            Visit this school’s website to{' '}
            <a
              href={inStateTuitionInformation}
              rel="noopener noreferrer"
              target="_blank"
            >
              see any in-state tuition requirements.
            </a>
          </p>
        </VaModal>
      </span>
    );
  };

  const renderLandingPageModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('giBillChapter')}
        modalTitle="Which GI Bill benefit do you want to use?"
        large
      >
        <div>
          {' '}
          <p>
            You may be eligible for multiple types of education and training
            programs. Different programs offer different benefits, so it’s
            important to choose the program that will best meet your needs. Use
            this tool to compare programs and schools.
          </p>
          <p>
            Learn more about{' '}
            <a
              href="/education/eligibility/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GI Bill program benefits and eligibility requirements
            </a>
            .
          </p>
        </div>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('bookStipendInfo')}
        modalTitle="Book stipend"
      >
        <BookStipendInfoModalContent />
      </VaModal>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('vetTec')}
        modalTitle="VET TEC"
      >
        <div>
          <p>
            Veteran Employment Through Technology Education Courses (VET TEC) is
            a 5-year pilot program that matches Veterans with high-tech training
            providers. Veterans can start or advance their career in the
            high-tech industry with a training program that’ll take months—or
            just weeks—to complete. The pilot program started in 2019 and runs
            through March 31, 2024.
          </p>
          <p>
            <a
              href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Learn more about VET TEC
            </a>
          </p>
        </div>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('cumulativeService')}
        modalTitle="Cumulative Post-9/11 service"
        large
      >
        <div>
          <p>
            The Post-9/11 GI Bill provides financial support for education and a
            housing allowance. To qualify for this program, you must have served
            after September 10, 2001 for at least 90 days or, if you were
            discharged with a service-connected disability, for at least 30
            days. The service period for these benefits doesn’t include your
            entry and initial skill training. You also need to have received an
            honorable discharge.
          </p>
        </div>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('comparisonLimit')}
        modalTitle="You’ve reached the comparison limit"
      >
        <p>
          You can compare up to 3 schools or employers. You’ll have to remove
          one of your selections before you can add another to the comparison.
        </p>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('enlistmentService')}
        modalTitle="Completed an enlistment of (MGIB):"
      >
        <p>
          The Montgomery GI Bill – Active Duty provides education benefits to
          Veterans and service members who have served at least two years of
          active duty. When using this tool, you will need to select the length
          of your original active duty enlistment obligation in order to get an
          estimate of your monthly benefit. The amount of time you served (2
          year enlistment vs. 3+ year enlistment) will impact your monthly
          payment amount when using the Montgomery GI Bill. To learn more about
          MGIB please visit &nbsp;
          <a
            href="http://www.benefits.va.gov/gibill/mgib_ad.asp"
            id="anch_399"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.benefits.va.gov/gibill/mgib_ad.asp
          </a>
          .
        </p>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('consecutiveService')}
        modalTitle="Length of longest active duty tour (REAP)"
      >
        <p>
          The REAP program pays benefits to eligible Reservists or Guard members
          who were called or ordered to active duty for at least 90 consecutive
          days in response to a war or national emergency declared by the
          President or Congress. REAP payment amounts are based on length of
          consecutive days of active-duty service with rates increasing at one
          year and again at two years of consecutive service. To learn more
          about REAP please visit &nbsp;
          <a
            href="https://www.benefits.va.gov/gibill/reap.asp"
            id="anch_403"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.benefits.va.gov/gibill/reap.asp
          </a>
          .
        </p>
      </VaModal>
    </span>
  );

  const renderVetTecSearchResultsModals = () => (
    <span>
      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('preferredProvider')}
        modalTitle="Preferred training providers"
      >
        <p>
          A provider is "preferred" if the training facility agrees to refund
          tuition and fees to VA if the student completes the program and
          doesn’t find meaningful employment within 180 days.
        </p>
      </VaModal>

      <VaModal
        onCloseEvent={hideModal}
        visible={shouldDisplayModal('cautionaryWarnings')}
        modalTitle="Cautionary warnings and school closings"
      >
        <p>
          VA applies caution flags when we, or another federal agency, have
          increased regulatory or legal scrutiny of an educational program. We
          recommend students consider these warnings before enrolling in flagged
          programs.
        </p>
        <p>
          When VA receives notice that a school or campus location will be
          closing, we add a school closing flag to that profile. Once the
          closing date passes, we remove the institution from the Comparison
          Tool during the next system update.
        </p>
        <p>
          {' '}
          To learn more about caution flags,{' '}
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#CF"
            target="_blank"
            rel="noopener noreferrer"
          >
            visit the About this tool page
          </a>
          .
        </p>
      </VaModal>
    </span>
  );

  const renderComparePageModals = () => {
    return (
      <span>
        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('sizeOfInstitution')}
          modalTitle="Size of institution"
        >
          <SizeOfInstitutionsModalContent />
        </VaModal>
        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('specializedMission')}
          modalTitle={
            environment.isProduction()
              ? 'Specialized mission'
              : 'Community focus'
          }
        >
          <SpecializedMissionModalContent />
        </VaModal>
        <VaModal
          onCloseEvent={hideModal}
          visible={shouldDisplayModal('cautionFlags')}
        >
          <CautionFlagsModalContent />
        </VaModal>
      </span>
    );
  };

  return (
    <span>
      {renderLandingPageModals()}
      {renderProfilePageModals()}
      {renderProfileSchoolHeaderModals()}
      {renderProfileVeteranSummaryModals()}
      {renderProfileSummaryModals()}
      {renderProfileHistoryModals()}
      {renderProfileCautionFlagModals()}
      {renderProfileCalculatorModals()}
      {renderVetTecSearchResultsModals()}
      {renderComparePageModals()}
    </span>
  );
}

const mapStateToProps = state => ({
  modals: state.modals,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => {
    dispatch(actions.showModal(null));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modals);
