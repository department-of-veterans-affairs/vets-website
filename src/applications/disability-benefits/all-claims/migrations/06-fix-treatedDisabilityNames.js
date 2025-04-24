import clone from 'platform/utilities/data/clone';

import { sippableId } from '../utils';

export default function fixTreatedDisabilityNamesKey(savedData) {
  const formData = clone(savedData.formData);
  const facilities = formData.vaTreatmentFacilities;
  const powDisabilities = formData['view:isPow']?.powDisabilities;
  if (facilities) {
    formData.vaTreatmentFacilities = facilities.map(entry => ({
      ...entry,
      treatedDisabilityNames: Object.entries(
        entry.treatedDisabilityNames,
      ).reduce(
        (names, [key, value]) => ({
          ...names,
          [sippableId(key)]: value,
        }),
        {},
      ),
    }));
  }
  if (powDisabilities) {
    formData['view:isPow'].powDisabilities = Object.entries(
      powDisabilities,
    ).reduce(
      (disabilities, [key, value]) => ({
        ...disabilities,
        [sippableId(key)]: value,
      }),
      {},
    );
  }
  return {
    formData,
    metadata: savedData.metadata,
  };
}
