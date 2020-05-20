import { states as statesList } from 'vets-json-schema/dist/constants.json';

// create an object of states using this pattern - {abbreviation}: {full name}
// e.g. "DC": "District of Columnbia"
const states = statesList.USA.reduce(
  (stateList, { value, label }) => ({
    ...stateList,
    [value]: label,
  }),
  {},
);

const militaryStates = ['AA', 'AE', 'AP'];
const militaryCities = ['APO', 'FPO', 'DPO'];

export default { states, militaryStates, militaryCities };
