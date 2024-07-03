import yourBackgroundInformation from './yourBackgroundInformation';
import yesNoPageSchema from '../helpers/yesNoPageSchema';
import HasAConviction from '../../components/HasAConviction';
import convictionDetails from './convictionDetails';
import courtMartialDetails from './courtMartialDetails';
import IsUnderCharges from '../../components/IsUnderCharges';
import conditionThatAffectsRepresentationDetails from './conditionThatAffectsRepresentationDetails';
import conditionThatAffectsExaminationDetails from './conditionThatAffectsExaminationDetails';

/** @type {PageSchema} */
export default {
  title: 'Background information',
  pages: {
    yourBackgroundInformation,
    hasAConviction: yesNoPageSchema({
      title: 'Conviction',
      path: 'conviction',
      question:
        'Have you ever been convicted, imprisoned, or sentenced to probation or parole?',
      description: HasAConviction,
    }),
    convictionDetails,
    hasBeenCourtMartialed: yesNoPageSchema({
      title: 'Court martialed',
      path: 'court-martialed',
      depends: formData => formData?.militaryServiceExperiences?.length,
      question: 'Have you ever been convicted by a military court-martial?',
    }),
    courtMartialDetails,
    isUnderCharges: yesNoPageSchema({
      title: 'Under charges',
      path: 'under-charges',
      question: 'Are you now under charges for any violations?',
      description: IsUnderCharges,
    }),
    hasResignedFromEducation: yesNoPageSchema({
      title: 'Resigned from education',
      path: 'resigned-from-education',
      question:
        'Have you ever been suspended, expelled, or asked to resign or withdraw from any educational institution, or have you resigned or withdrawn from any such institution in time to avoid discipline, suspension, or expulsion for conduct involving dishonesty, fraud, misrepresentation, or deceit?',
    }),
    hasBeenDisciplinedForDishonesty: yesNoPageSchema({
      title: 'Disciplined for dishonesty',
      path: 'disciplined-for-dishonesty',
      question:
        'Have you ever been disciplined, reprimanded, suspended, or terminated in any job for conduct involving dishonesty, fraud, misrepresentation, deceit, or any violation of federal or state laws or regulations?',
    }),
    hasResignedForDishonesty: yesNoPageSchema({
      title: 'Resigned for dishonesty',
      path: 'resigned-for-dishonesty',
      question:
        'Have you ever resigned, retired from, or quit a job when you were under investigation or inquiry for conduct which could have been considered as involving dishonesty, fraud, misrepresentation, deceit, or violation of federal or state laws or regulations, or after receiving notice or being advised of possible investigation, inquiry, or disciplinary action for such conduct?',
    }),
    hasBeenRepForAgency: yesNoPageSchema({
      title: 'Representative for agency',
      path: 'representative-for-agency',
      question:
        'Have you ever functioned as a representative, agent, or attorney before a state or federal department or agency?',
    }),
    hasBeenReprimandedInAgency: yesNoPageSchema({
      title: 'Reprimanded in agency',
      path: 'reprimanded-in-agency',
      question:
        'Have you ever been reprimanded, suspended, or barred from practice before any court, bar, or federal or state agency, or have you resigned membership in the bar of any court, or federal or state agency to avoid reprimand, suspension, or disbarment for conduct involving dishonesty, fraud, misrepresentation, or deceit?',
    }),
    hasAppliedForVAAccreditation: yesNoPageSchema({
      title: 'Applied for VA accreditation',
      path: 'applied-for-va-accreditation',
      question:
        'Have you ever applied for accreditation by the Department of Veterans Affairs as a representative of a Veteran Service Organization, agent, or attorney?',
    }),
    hasBeenTerminatedByVSOrg: yesNoPageSchema({
      title: 'Terminated by VSOrg',
      path: 'terminated-by-vsorg',
      question:
        'If you were previously accredited as a representative of a Veteran Service Organization, was that accreditation terminated or suspended at the request of the organization?',
    }),
    hasConditionThatAffectsRepresentation: yesNoPageSchema({
      title: 'Condition that affects representation',
      path: 'condition-that-affects-representation',
      question:
        'Do you have any condition or impairment that in any way currently affects, or, if untreated or not otherwise actively manager, could affect your ability to represent claimants in a competent and professional manner?',
      description:
        'Examples of conditions or impairments include substance abuse, alcohol abuse, mental or emotional, nervous, or behavioral disorder or conditions',
    }),
    conditionThatAffectsRepresentationDetails,
    hasConditionThatAffectsExamination: yesNoPageSchema({
      title: 'Condition that affects examination',
      path: 'condition-that-affects-examination',
      depends: formData => formData?.role === 'CLAIMS_AGENT',
      question:
        'Do you have any physical limitations which would interfere with your completion of written examination administered under the supervision of a VA district counsel?',
    }),
    conditionThatAffectsExaminationDetails,
  },
};
