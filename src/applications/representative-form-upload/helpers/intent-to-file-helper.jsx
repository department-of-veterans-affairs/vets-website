import { isEmpty } from 'lodash';
import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const urlPrefix = '/submit-va-form-21-0966/';

const goPathAfterGettingITF = (
  intent,
  formData,
  goPath,
  goNextPath,
  setFormData,
) => {
  const formDataToSet = { ...formData, 'view:activeITF': intent };

  setFormData(formDataToSet);

  if (!isEmpty(formDataToSet?.['view:activeITF'])) {
    goPath(`${urlPrefix}existing-itf`);
  } else {
    goNextPath();
  }
};

const fetchIntentToFile = async (formData, benefitType, goPath, goNextPath) => {
  let params = `?veteranFirstName=${encodeURIComponent(
    formData.veteranFullName.first,
  )}`;
  params = `${params}&veteranLastName=${encodeURIComponent(
    formData.veteranFullName.last,
  )}`;
  params = `${params}&veteranDateOfBirth=${encodeURIComponent(
    formData.veteranDateOfBirth,
  )}`;
  params = `${params}&veteranSsn=${encodeURIComponent(formData.veteranSsn)}`;
  params = `${params}&benefitType=${encodeURIComponent(benefitType)}`;
  try {
    return await apiRequest(
      `${
        environment.API_URL
      }/accredited_representative_portal/v0/intent_to_file${params}`,
    );
  } catch (error) {
    if (
      error.errors &&
      typeof error.errors[0] === 'string' &&
      error.errors[0].match(/^not allowed/)
    ) {
      goPath(`${urlPrefix}permission-error`);
    } else {
      goNextPath();
    }
    return null;
  }
};

export const getIntentsToFile = ({
  formData,
  goPath,
  goNextPath,
  setFormData,
}) => {
  goPath(`${urlPrefix}get-itf-status`);

  try {
    fetchIntentToFile(formData, formData.benefitType, goPath, goNextPath).then(
      val => {
        if (val) {
          goPathAfterGettingITF(
            val.data,
            formData,
            goPath,
            goNextPath,
            setFormData,
          );
        }
      },
    );
  } catch (error) {
    goNextPath();
  }
};
