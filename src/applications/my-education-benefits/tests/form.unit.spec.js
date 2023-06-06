import { expect } from 'chai';
import formConfig from '../config/form';

describe('Service History Chapter', () => {
  const {
    schema,
    uiSchema,
  } = formConfig?.chapters?.serviceHistoryChapter?.pages?.serviceHistory;

  it('renders the old Service History header', () => {
    expect(uiSchema['view:subHeading']).to.exist;
    expect(schema.properties['view:subHeading']).to.exist;
  });

  it('renders the new Service History header', () => {
    expect(uiSchema['view:newSubHeading']).to.exist;
    expect(schema.properties['view:newSubHeading']).to.exist;
  });
});
