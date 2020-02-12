import * as actions from '../../actions/ui';
import sinon from 'sinon';
import { expect } from 'chai';

describe('updateFormField', () => {
  it('calls the passed-in helpers and creates the correct action', () => {
    const convertNextValueStub = sinon.stub().callsFake(val => val);
    const validateCleanDataStub = sinon.stub().callsFake(() => ({}));
    const action = actions.updateFormField(
      'address',
      convertNextValueStub,
      validateCleanDataStub,
      { city: 'sf', state: 'ca' },
      'city',
    );
    expect(convertNextValueStub.callCount).to.eql(1);
    expect(validateCleanDataStub.callCount).to.eql(1);
    expect(action).to.deep.equal({
      type: actions.UPDATE_PROFILE_FORM_FIELD,
      field: 'address',
      newState: {
        value: { city: 'sf', state: 'ca' },
        validations: {},
      },
    });
  });
});

describe('updateFormFieldWithSchema', () => {
  it('creates the correct action', () => {
    const schema = {
      type: 'object',
      properties: {
        city: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      city: {
        'ui:title': 'City',
      },
    };
    const action = actions.updateFormFieldWithSchema(
      'address',
      { city: 'sf', state: 'ca' },
      schema,
      uiSchema,
    );

    expect(action).to.deep.equal({
      type: actions.UPDATE_PROFILE_FORM_FIELD,
      field: 'address',
      newState: {
        value: { city: 'sf', state: 'ca' },
        formSchema: schema,
        uiSchema,
      },
    });
  });
});
