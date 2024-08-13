import backgroundInformationIntro from './backgroundInformationIntro';
import yesNoPageSchema from '../helpers/yesNoPageSchema';
import HasAConviction from '../../components/06-background-information-chapter/HasAConviction';
import backgroundInformationDetailsPageSchema from '../helpers/backgroundInformationDetailsPageSchema';
import ExplanationDescription from '../../components/06-background-information-chapter/ExplanationDescription';
import HasBeenCourtMartialed from '../../components/06-background-information-chapter/HasBeenCourtMartialed';
import IsUnderCharges from '../../components/06-background-information-chapter/IsUnderCharges';
import HasBeenTerminatedByVSOrg from '../../components/06-background-information-chapter/HasBeenTerminatedByVSOrg';
import HasConditionThatAffectsRepresentation from '../../components/06-background-information-chapter/HasConditionThatAffectsRepresentation';
import ConditionThatAffectsRepresentationDetails from '../../components/06-background-information-chapter/ConditionThatAffectsRepresentationDetails';

const convictionDetailsQuestion =
  'Provide the date, a detailed explanation, and the location of the conviction as well as the name and address of the military authority or court involved.';

/** @type {PageSchema} */
export default {
  title: 'Background information',
  pages: {
    backgroundInformationIntro,
    hasAConviction: yesNoPageSchema({
      title: 'Conviction',
      path: 'conviction',
      question:
        'Have you ever been convicted, imprisoned, sentenced to probation or parole?',
      description: HasAConviction,
    }),
    convictionDetails: backgroundInformationDetailsPageSchema({
      title: 'Conviction details',
      path: 'conviction-details',
      depends: formData => formData.conviction,
      question: convictionDetailsQuestion,
      explanationDescription: ExplanationDescription,
    }),
    hasBeenCourtMartialed: yesNoPageSchema({
      title: 'Court martialed',
      path: 'court-martialed',
      depends: formData => formData?.militaryServiceExperiences?.length,
      question: 'Have you ever been convicted by a military court-martial?',
      description: HasBeenCourtMartialed,
    }),
    courtMartialedDetails: backgroundInformationDetailsPageSchema({
      title: 'Court martialed details',
      path: 'court-martialed-details',
      depends: formData => formData.courtMartialed,
      question: convictionDetailsQuestion,
      explanationDescription: ExplanationDescription,
    }),
    isUnderCharges: yesNoPageSchema({
      title: 'Under charges',
      path: 'under-charges',
      question: 'Are you now under charges for any violations of law?',
      description: IsUnderCharges,
    }),
    underChargesDetails: backgroundInformationDetailsPageSchema({
      title: 'Under charges details',
      path: 'under-charges-details',
      depends: formData => formData.underCharges,
      question:
        'Provide the date, a detailed explanation, and the location of the violation as well as the name and address of the military authority or court involved.',
      explanationDescription: ExplanationDescription,
    }),
    hasResignedFromEducation: yesNoPageSchema({
      title: 'Resigned from education',
      path: 'resigned-from-education',
      question:
        'Have you ever been suspended, expelled, or asked to resign or withdraw from any educational institution?',
    }),
    resignedFromEducationDetails: backgroundInformationDetailsPageSchema({
      title: 'Resigned from education details',
      path: 'resigned-from-education-details',
      depends: formData => formData.resignedFromEducation,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of the suspension, expulsion, or resignation.',
      explanationDescription: ExplanationDescription,
    }),
    hasWithdrawnFromEducation: yesNoPageSchema({
      title: 'Withdrawn from education',
      path: 'withdrawn-from-education',
      question:
        'Have you ever withdrawn from any educational institution in time to avoid discipline, suspension, or expulsion for conduct involving dishonesty, fraud, misrepresentation, or deceit?',
    }),
    withdrawnFromEducationDetails: backgroundInformationDetailsPageSchema({
      title: 'Withdrawn from education details',
      path: 'withdrawn-from-education-details',
      depends: formData => formData.withdrawnFromEducation,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of your withdrawal.',
      explanationDescription: ExplanationDescription,
    }),
    hasBeenDisciplinedForDishonesty: yesNoPageSchema({
      title: 'Disciplined for dishonesty',
      path: 'disciplined-for-dishonesty',
      question:
        'Have you ever been disciplined, reprimanded, suspended, or terminated in any job for conduct involving dishonesty, fraud, misrepresentation, deceit, or any violation of Federal or state laws or regulations?',
    }),
    disciplinedForDishonestyDetails: backgroundInformationDetailsPageSchema({
      title: 'Disciplined for dishonesty details',
      path: 'disciplined-for-dishonesty-details',
      depends: formData => formData.disciplinedForDishonesty,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of your discipline, reprimand, suspension, or termination.',
      explanationDescription: ExplanationDescription,
    }),
    hasResignedForDishonesty: yesNoPageSchema({
      title: 'Resigned for dishonesty',
      path: 'resigned-for-dishonesty',
      question:
        'Have you ever resigned, retired from, or quit a job when you were under investigation or inquiry for conduct which could have been considered as involving dishonesty, fraud, misrepresentation, deceit, or violation of Federal or state laws or regulations, or after receiving notice or being advised of possible investigation, inquiry, or disciplinary action for such conduct?',
    }),
    resignedForDishonestyDetails: backgroundInformationDetailsPageSchema({
      title: 'Resigned for dishonesty details',
      path: 'resigned-for-dishonesty-details',
      depends: formData => formData.resignedForDishonesty,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of your resignation or retirement.',
      explanationDescription: ExplanationDescription,
    }),
    hasBeenRepForAgency: yesNoPageSchema({
      title: 'Representative for agency',
      path: 'representative-for-agency',
      question:
        'Have you ever functioned as a representative, agent, or attorney before a state or Federal department or agency?',
    }),
    repForAgencyDetails: backgroundInformationDetailsPageSchema({
      title: 'Representative for agency details',
      path: 'representative-for-agency-details',
      depends: formData => formData.representativeForAgency,
      question:
        'Provide details of your service, including which Federal or state department or agency and relevant dates.',
    }),
    hasBeenReprimandedInAgency: yesNoPageSchema({
      title: 'Reprimanded in agency',
      path: 'reprimanded-in-agency',
      question:
        'Have you ever been reprimanded, suspended, denied from practice, or barred from practice before any court, bar, Federal, or state agency?',
    }),
    reprimandedInAgencyDetails: backgroundInformationDetailsPageSchema({
      title: 'Reprimanded in agency details',
      path: 'reprimanded-in-agency-details',
      depends: formData => formData.reprimandedInAgency,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of your reprimand, suspension, denial from practice, or barring.',
      explanationDescription: ExplanationDescription,
    }),
    hasResignedFromAgency: yesNoPageSchema({
      title: 'Resigned from agency',
      path: 'resigned-from-agency',
      question:
        'Have you ever resigned membership in the bar of any court, or Federal or state agency to avoid reprimand, suspension, or disbarment for conduct involving  dishonesty, fraud, misrepresentation, or deceit?',
    }),
    resignedFromAgencyDetails: backgroundInformationDetailsPageSchema({
      title: 'Resigned from agency details',
      path: 'resigned-from-agency-details',
      depends: formData => formData.resignedFromAgency,
      question:
        'Provide a detailed statement setting forth all relevant facts and dates of your resignation.',
      explanationDescription: ExplanationDescription,
    }),
    hasAppliedForVaAccreditation: yesNoPageSchema({
      title: 'Applied for VA accreditation',
      path: 'applied-for-va-accreditation',
      question:
        'Have you ever applied for accreditation by the Department of Veterans Affairs as a representative of a Veteran Service Organization (VSO), agent, or attorney?',
    }),
    appliedForVaAccreditationDetails: backgroundInformationDetailsPageSchema({
      title: 'Applied for VA accreditation details',
      path: 'applied-for-va-accreditation-details',
      depends: formData => formData.appliedForVaAccreditation,
      question:
        'Provide details of your application, including when you previously applied, if you applied for accreditation as an attorney, agent, or VSO representative, and whether you are currently accredited as a VSO representative.',
    }),
    hasBeenTerminatedByVSOrg: yesNoPageSchema({
      title: 'Terminated by VSOrg',
      path: 'terminated-by-vsorg',
      question:
        'If you were previously accredited as a representative of a Veteran Service Organization, was that accreditation terminated or suspended at the request of the organization?',
      description: HasBeenTerminatedByVSOrg,
    }),
    terminatedByVSOrgDetails: backgroundInformationDetailsPageSchema({
      title: 'Terminated by VSOrg details',
      path: 'terminated-by-vsorg-details',
      depends: formData => formData.terminatedByVsorg,
      question: 'Provide relevant details of your termination or suspension.',
      explanationDescription: ExplanationDescription,
    }),
    hasConditionThatAffectsRepresentation: yesNoPageSchema({
      title: 'Condition that affects representation',
      path: 'condition-that-affects-representation',
      question:
        'Do you have any condition or impairment that in any way currently affects, or, if untreated or not otherwise actively manager, could affect your ability to represent claimants in a competent and professional manner?',
      description: HasConditionThatAffectsRepresentation,
    }),
    conditionThatAffectsRepresentationDetails: backgroundInformationDetailsPageSchema(
      {
        title: 'Condition that affects representation details',
        path: 'condition-that-affects-representation-details',
        depends: formData => formData.conditionThatAffectsRepresentation,
        question:
          'Describe the condition or impairment, and any treatment you receive now or in the past year.',
        explanationDescription: ConditionThatAffectsRepresentationDetails,
      },
    ),
    hasConditionThatAffectsExamination: yesNoPageSchema({
      title: 'Condition that affects examination',
      path: 'condition-that-affects-examination',
      depends: formData => formData?.role === 'CLAIMS_AGENT',
      question:
        'Do you have any physical limitations which would interfere with your completion of written examination administered under the supervision of a VA district counsel?',
    }),
    conditionThatAffectsExaminationDetails: backgroundInformationDetailsPageSchema(
      {
        title: 'Condition that affects examination details',
        path: 'condition-that-affects-examination-details',
        depends: formData => formData.conditionThatAffectsExamination,
        question:
          'State the nature of such limitations and provide details of any special accommodation deemed necessary.',
      },
    ),
  },
};
