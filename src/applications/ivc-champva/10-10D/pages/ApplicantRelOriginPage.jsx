import AdditionalDocumentationAlert from '../components/AdditionalDocumentationAlert';
import {
  relationshipToVeteranUI,
  customRelationshipSchema,
} from '../components/CustomRelationshipPattern';
import { applicantWording } from '../helpers/wordingCustomization';
import ApplicantField from '../components/Applicant/ApplicantField';
import {
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ApplicantRelationshipPage from './ApplicantRelationshipPage';

function generateOptions({ data, pagePerItemIndex }) {
  const { keyname } = data;
  const currentListItem = data?.applicants?.[pagePerItemIndex];
  const personTitle = 'Sponsor';
  const applicant = applicantWording(currentListItem); // todo: use new args
}

export default function ApplicantRelOriginPage(props) {
  // TODO:
  // - [X] Add a prop to applicantrelationshippage === generateOptions()
  // - [X] Update applicantrelationshippage to take prop that === keyname (applicantRelationshipOrigin)
  const newProps = { ...props, keyname: 'applicantRelationshipOrigin' };
  return ApplicantRelationshipPage(newProps);
}
