import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

export default [
  // 0 > 1, convert keys to camel case
  ({ formData, metadata }) => {
    let newFormData = formData;

    const programs = get('educationDetails.programs', formData);
    if (programs && programs.length) {
      Object.entries(formData.programs).forEach(([key, value]) => {
        switch (key) {
          case 'Post-9/11 Ch 33':
            newFormData = set('educationDetails.programs.chapter33', value);
            break;
          case 'MGIB-AD Ch 30':
            newFormData = set('educationDetails.programs.chapter30', value);
            break;
          case 'MGIB-SR Ch 1606':
            newFormData = set('educationDetails.programs.chapter1606', value);
            break;
          case 'TATU':
            newFormData = set('educationDetails.programs.tatu', value);
            break;
          case 'REAP':
            newFormData = set('educationDetails.programs.reap', value);
            break;
          case 'DEA Ch 35':
            newFormData = set('educationDetails.programs.chapter35', value);
            break;
          case 'VRE Ch 31':
            newFormData = set('educationDetails.programs.chapter31', value);
            break;
          default:
            break;
        }
      });
    }

    const assistance = get('educationDetails.assistance', formData);
    if (assistance && assistance.length) {
      Object.entries(formData.assistance).forEach(([key, value]) => {
        switch (key) {
          case 'TA':
            newFormData = set('educationDetails.assistance.ta', value);
            break;
          case 'TA-AGR':
            newFormData = set('educationDetails.assistance.taAgr', value);
            break;
          case 'MyCAA':
            newFormData = set('educationDetails.assistance.myCaa', value);
            break;
          case 'FFA':
            newFormData = set('educationDetails.assistance.ffa', value);
            break;
          default:
            break;
        }
      });
    }

    return { formData: newFormData, metadata };
  },
];
