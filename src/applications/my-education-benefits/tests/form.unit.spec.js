import { expect } from 'chai';
import formConfig from '../config/form';

describe('Service History Chapter', () => {
  const {
    schema,
    uiSchema,
  } = formConfig?.chapters?.serviceHistoryChapter?.pages?.serviceHistory;

  it('renders Service History header', () => {
    expect(uiSchema['view:subHeading']).to.exist;
    expect(schema.properties['view:subHeading']).to.exist;
  });
});
