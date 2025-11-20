import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { generateParticipantName } from '../../helpers';
import content from '../../locales/en/content.json';

const EDIT_PREFIX = content['button--edit'];

const MedicarePageTitle = ({ item, title }) => {
  const formData = useSelector(state => state.form?.data ?? {});
  const fullName = generateParticipantName(item, undefined, formData);
  const isEdit = Boolean(getArrayUrlSearchParams().get('edit'));
  const prefix = isEdit ? EDIT_PREFIX : '';
  return [prefix, `${fullName}’s`, title].filter(Boolean).join(' ');
};

MedicarePageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  item: PropTypes.object,
};

export default MedicarePageTitle;
