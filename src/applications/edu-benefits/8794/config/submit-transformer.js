import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { dateSigned, transformPhoneNumber } from '../helpers';

export function transform(formConfig, form) {
  const designatingOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.designatingOfficial.phoneType;

    if (clonedData.designatingOfficial.phoneNumber) {
      clonedData.designatingOfficial.phoneNumber = transformPhoneNumber(
        clonedData.designatingOfficial.phoneNumber,
      );
    }
    if (clonedData.designatingOfficial.internationalPhoneNumber) {
      clonedData.designatingOfficial.internationalPhoneNumber = transformPhoneNumber(
        clonedData.designatingOfficial.internationalPhoneNumber,
      );
    }

    return {
      ...clonedData,
    };
  };
  const primaryOfficialTransform = formData => {
    const clonedData = _.cloneDeep(formData);

    delete clonedData.primaryOfficialDetails.phoneType;

    if (clonedData.primaryOfficialDetails.phoneNumber) {
      clonedData.primaryOfficialDetails.phoneNumber = transformPhoneNumber(
        clonedData.primaryOfficialDetails.phoneNumber,
      );
    }
    if (clonedData.primaryOfficialDetails.internationalPhoneNumber) {
      clonedData.primaryOfficialDetails.internationalPhoneNumber = transformPhoneNumber(
        clonedData.primaryOfficialDetails.internationalPhoneNumber,
      );
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
              phoneNumber: additionalOfficial?.additionalOfficialDetails
                ?.phoneNumber
                ? transformPhoneNumber(
                    additionalOfficial.additionalOfficialDetails.phoneNumber,
                  )
                : null,
              internationalPhoneNumber: additionalOfficial
                ?.additionalOfficialDetails?.internationalPhoneNumber
                ? transformPhoneNumber(
                    additionalOfficial.additionalOfficialDetails
                      .internationalPhoneNumber,
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
    transformForSubmit(formConfig, { ...form, data: formData });

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
