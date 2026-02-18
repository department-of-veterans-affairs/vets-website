import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  formatFullName,
  generateParticipantName,
  getAgeInYears,
  getEligibleApplicantsWithoutMedicare,
} from '../../utils/helpers';
import content from '../../locales/en/content.json';

const EDIT_TEXT = content['button--edit'];
const APPLICANT_TEXT = content['noun--applicant'];
const NO_PARTICIPANT_TEXT = content['medicare--participant-none'];

const isPlaceholderName = value => {
  const normalized = (value || '').toLowerCase().trim();
  return [APPLICANT_TEXT, NO_PARTICIPANT_TEXT].some(
    text => normalized === (text || '').toLowerCase().trim(),
  );
};

const resolveTitleName = (item, formData) => {
  const participantName = generateParticipantName(item, undefined, formData);
  if (!isPlaceholderName(participantName)) return participantName;

  const applicants = getEligibleApplicantsWithoutMedicare(formData) ?? [];
  const match = applicants.find(a => getAgeInYears(a.applicantDob) >= 65);
  return match ? formatFullName(match.applicantName) : participantName;
};

const MedicarePageTitle = ({ item, title }) => {
  const formData = useSelector(state => state.form?.data ?? {});
  const fullName = resolveTitleName(item, formData) || APPLICANT_TEXT;
  const isEdit = Boolean(getArrayUrlSearchParams().get('edit'));
  const prefix = isEdit ? EDIT_TEXT : '';
  return [prefix, `${fullName}’s`, title].filter(Boolean).join(' ');
};

MedicarePageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  item: PropTypes.object,
};

export default MedicarePageTitle;
