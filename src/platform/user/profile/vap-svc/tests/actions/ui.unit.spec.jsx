import { expect } from 'chai';
import * as actions from '../../actions/ui';

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
