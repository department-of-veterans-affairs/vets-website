import { createSelector } from 'reselect';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';
import { states } from 'platform/forms/address';

export const isChapter33 = form =>
  !!form['view:benefit']?.chapter33 || !!form['view:benefit']?.fryScholarship;

export const displayConfirmEligibility = form =>
  !isChapter33(form) ||
  (!form.isEnrolledStem &&
    !form.isPursuingTeachingCert &&
    !form.isPursuingClinicalTraining) ||
  form.benefitLeft === 'moreThanSixMonths' ||
  form['view:remainingEntitlement']?.totalDays > 180;

export function updateProgramDetailsSchema() {
  const usaStates = states.USA.map(state => state.value);
  const usaLabels = states.USA.map(state => state.label);
  const canProvinces = states.CAN.map(state => state.value);
  const canLabels = states.CAN.map(state => state.label);
  const mexStates = states.MEX.map(state => state.value);
  const mexLabels = states.MEX.map(state => state.label);

  const addressChangeSelector = createSelector(
    ({ formData, path }) => get(path.concat('schoolCountry'), formData),
    (...args) => get('schema', ...args),
    (currentCountry, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required,
      };
      const country =
        currentCountry || addressSchema.properties.schoolCountry.default;
      let stateList;
      let labelList;
      if (country === 'USA') {
        stateList = usaStates;
        labelList = usaLabels;
      } else if (country === 'CAN') {
        stateList = canProvinces;
        labelList = canLabels;
      } else if (country === 'MEX') {
        stateList = mexStates;
        labelList = mexLabels;
      }

      if (stateList) {
        // We have a list and it’s different, so we need to make schema updates
        if (addressSchema.properties.schoolState.enum !== stateList) {
          const withEnum = set(
            'schoolState.enum',
            stateList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = set(
            'schoolState.enumNames',
            labelList,
            withEnum,
          );

          // all the countries with schoolState lists require the schoolState field, so add that if necessary
          schemaUpdate.required = addressSchema.required.concat('schoolState');
        }
        // We don’t have a state list for the current country, but there’s an enum in the schema
        // so we need to update it
      } else if (addressSchema.properties.schoolState.enum) {
        const withoutEnum = unset('schoolState.enum', schemaUpdate.properties);
        schemaUpdate.properties = unset('schoolState.enumNames', withoutEnum);
        schemaUpdate.required = addressSchema.required.filter(
          field => field !== 'schoolState',
        );
      }

      // Canada has a different title than others, so set that when necessary
      if (
        country === 'CAN' &&
        addressSchema.properties.schoolState.title !== 'Province'
      ) {
        schemaUpdate.properties = set(
          'schoolState.title',
          'Province',
          schemaUpdate.properties,
        );
      } else if (
        country !== 'CAN' &&
        addressSchema.properties.schoolState.title !== 'State'
      ) {
        schemaUpdate.properties = set(
          'schoolState.title',
          'State',
          schemaUpdate.properties,
        );
      }

      return schemaUpdate;
    },
  );

  return (formData, schema, uiSchema, index, path) => {
    return addressChangeSelector({
      formData,
      schema,
      path,
    });
  };
}
