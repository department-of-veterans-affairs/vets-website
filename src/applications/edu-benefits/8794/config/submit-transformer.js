import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { dateSigned, getTransformIntlPhoneNumber } from '../helpers';

export function transform(formConfig, form) {
  const designatingOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.designatingOfficial.phoneType;

    if (clonedData.designatingOfficial.phoneNumber?.countryCode === 'US') {
      clonedData.designatingOfficial.phoneNumber = getTransformIntlPhoneNumber(
        clonedData.designatingOfficial.phoneNumber,
      );
    } else {
      clonedData.designatingOfficial.internationalPhoneNumber = getTransformIntlPhoneNumber(
        clonedData.designatingOfficial.phoneNumber,
      );
      delete clonedData.designatingOfficial.phoneNumber;
    }

    return {
      ...clonedData,
    };
  };
  const primaryOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.primaryOfficialDetails.phoneType;

    if (clonedData.primaryOfficialDetails.phoneNumber?.countryCode === 'US') {
      clonedData.primaryOfficialDetails.phoneNumber = getTransformIntlPhoneNumber(
        clonedData.primaryOfficialDetails.phoneNumber,
      );
    } else {
      clonedData.primaryOfficialDetails.internationalPhoneNumber = getTransformIntlPhoneNumber(
        clonedData.primaryOfficialDetails.phoneNumber,
      );
      delete clonedData.primaryOfficialDetails.phoneNumber;
    }

    return {
      ...clonedData,
    };
  };
  const additionalOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    if (clonedData['additional-certifying-official']?.length > 0) {
      return {
        ...clonedData,
        additionalCertifyingOfficials: clonedData[
          'additional-certifying-official'
        ]?.map(additionalOfficial => {
          return {
            additionalCertifyingOfficialsDetails: {
              hasVaEducationBenefits:
                additionalOfficial.additionalOfficialBenefitStatus
                  .hasVaEducationBenefits,
              trainingCompletionDate: additionalOfficial
                .additionalOfficialTraining?.trainingCompletionDate
                ? additionalOfficial.additionalOfficialTraining
                    ?.trainingCompletionDate
                : null,
              fullName: additionalOfficial.additionalOfficialDetails.fullName,
              title: additionalOfficial.additionalOfficialDetails.title,
              phoneNumber:
                additionalOfficial.additionalOfficialDetails.phoneNumber
                  .countryCode === 'US'
                  ? getTransformIntlPhoneNumber(
                      additionalOfficial.additionalOfficialDetails.phoneNumber,
                    )
                  : null,
              // additionalOfficial?.additionalOfficialDetails?.phoneNumber
              //   .contact,
              internationalPhoneNumber:
                additionalOfficial.additionalOfficialDetails.phoneNumber
                  .countryCode !== 'US'
                  ? getTransformIntlPhoneNumber(
                      additionalOfficial.additionalOfficialDetails.phoneNumber,
                    )
                  : null,
              emailAddress:
                additionalOfficial.additionalOfficialDetails.emailAddress,
              trainingExempt: additionalOfficial?.additionalOfficialTraining
                ?.trainingExempt
                ? additionalOfficial.additionalOfficialTraining.trainingExempt
                : false,
            },
          };
        }),
      };
    }
    return {
      ...clonedData,
    };
  };

  const primaryOfficialTrainingTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
      primaryOfficialTraining: {
        trainingCompletionDate: clonedData.primaryOfficialTraining
          .trainingExempt
          ? dateSigned()
          : clonedData.primaryOfficialTraining.trainingCompletionDate,
        trainingExempt:
          clonedData?.primaryOfficialTraining?.trainingExempt ?? false,
      },
    };
  };

  const institutionDetailsTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
      institutionDetails: {
        ...clonedData.institutionDetails,
        facilityCode:
          clonedData?.institutionDetails?.facilityCode ?? '12345678',
      },
    };
  };

  const removeExcessTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData['additional-certifying-official'];
    delete clonedData.readOnlyCertifyingOfficials;

    return {
      ...clonedData,
    };
  };
  const privacyAgreementTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;
    delete clonedData.AGREED;

    return {
      ...clonedData,
      dateSigned: dateSigned(),
    };
  };

  const readOnlyOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    return {
      ...clonedData,
      readOnlyCertifyingOfficial: clonedData.readOnlyCertifyingOfficials,
    };
  };
  const usFormTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      { allowPartialAddress: true },
    );

  const transformedData = [
    designatingOfficialTransform,
    primaryOfficialTransform,
    additionalOfficialTransform,
    readOnlyOfficialTransform,
    removeExcessTransform,
    primaryOfficialTrainingTransform,
    institutionDetailsTransform,
    privacyAgreementTransform,
    usFormTransform,
  ].reduce((formData, transformer) => {
    return transformer(formData);
  }, form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
