import kitchenSink from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflow from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simple from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

const getFixtureData = name => {
  switch (name) {
    case 'overflow':
      return overflow.data;
    case 'kitchenSink':
      return kitchenSink.data;
    case 'simple':
      return simple.data;
    default:
      return simple.data;
  }
};
export default getFixtureData;
