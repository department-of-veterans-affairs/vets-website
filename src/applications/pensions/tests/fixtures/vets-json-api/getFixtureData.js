import kitchenSink from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflow from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simple from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

export const FixtureDataType = {
  OVERFLOW: 'overflow',
  KITCHEN_SINK: 'kitchen_sink',
  SIMPLE: 'simple',
};

const getFixtureData = name => {
  switch (name) {
    case FixtureDataType.OVERFLOW:
      return overflow.data;
    case FixtureDataType.KITCHEN_SINK:
      return kitchenSink.data;
    case FixtureDataType.SIMPLE:
      return simple.data;
    default:
      return simple.data;
  }
};
export default getFixtureData;
