import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { sippableId, capitalizeEachWord } from '../../utils';
import { uiSchema } from '../../pages/privateMedicalRecordsRelease';

const PrivateMedicalProvidersConditions = ({ formData }) => {
  // formData here is the treatedDisabilityNames object from the specific provider facility
  // We need to access the full form data from Redux to get newDisabilities
  const fullFormData = useSelector(state => state.form?.data);

  const conditions = formData || {};
  const claimedKeys = Object.keys(conditions).filter(
    key => key !== 'none' && conditions[key],
  );

  const conditionsContainer = fullFormData?.newDisabilities || [];
  const finalList = conditionsContainer
    .filter(condition => claimedKeys.includes(sippableId(condition.condition)))
    .map(condition => capitalizeEachWord(condition.condition));

  return {
    data: finalList,
    label: uiSchema.providerFacility.items.treatedDisabilityNames['ui:title'],
  };
};

PrivateMedicalProvidersConditions.propTypes = {
  formData: PropTypes.object,
};
export default PrivateMedicalProvidersConditions;
