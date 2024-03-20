import cloneDeep from 'platform/utilities/data/cloneDeep';

import kitchenSink from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflow from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simple from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

export const kitchenSinkFixture = cloneDeep(kitchenSink);
export const overflowFixture = cloneDeep(overflow);
export const simpleFixture = cloneDeep(simple);
