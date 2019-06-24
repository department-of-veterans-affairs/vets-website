import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

export default [
  // 0 > 1, convert keys to camel case
  ({ formData, metadata }) => {
    const programsKeyMap = {
      'post9::11 ch 33': 'chapter33',
      'mGIBAd ch 30': 'chapter30',
      'mGIBSr ch 1606': 'chapter1606',
      TATU: 'tatu',
      REAP: 'reap',
      'dea ch 35': 'chapter35',
      'vre ch 31': 'chapter31',
    };

    const assistanceKeyMap = {
      TA: 'ta',
      'TA-AGR': 'taAgr',
      MyCAA: 'myCaa',
      FFA: 'ffa',
    };

    let newFormData = formData;

    const programs = get('educationDetails.programs', formData);
    if (programs) {
      Object.entries(programsKeyMap).forEach(([oldKey, newKey]) => {
        if (typeof programs[oldKey] !== 'undefined') {
          newFormData = set(
            `educationDetails.programs.${newKey}`,
            programs[oldKey],
            newFormData,
          );
          delete newFormData.educationDetails.programs[oldKey];
        }
      });
    }

    const assistance = get(
      'educationDetails.assistance.view:assistance',
      formData,
    );
    if (assistance) {
      Object.entries(assistanceKeyMap).forEach(([oldKey, newKey]) => {
        if (typeof assistance[oldKey] !== 'undefined') {
          newFormData = set(
            `educationDetails.assistance.view:assistance.${newKey}`,
            assistance[oldKey],
            newFormData,
          );
          delete newFormData.educationDetails.assistance['view:assistance'][
            oldKey
          ];
        }
      });
    }

    const ffa = get('educationDetails.assistance.view:FFA', formData);

    if (typeof ffa !== 'undefined') {
      newFormData = set(
        `educationDetails.assistance.view:ffa.ffa`,
        ffa.FFA,
        newFormData,
      );
      delete newFormData.educationDetails.assistance['view:FFA'];
    }

    return { formData: newFormData, metadata };
  },
];
