import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { FormSaved } from '../../../src/js/common/schemaform/FormSaved';

describe('Schemaform <FormSaved>', () => {
  it('should render', () => {
    const route = {
      pageList: [
        {
          path: 'wrong-path'
        },
        {
          path: 'testing'
        }
      ],
      formConfig: {
      }
    };
    const user = {
      profile: {
        prefillsAvailable: []
      }
    };
    const lastSavedDate = 1497300513914;

    const tree = SkinDeep.shallowRender(
      <FormSaved lastSavedDate={lastSavedDate} route={route} user={user}/>
    );

    expect(tree.subTree('withRouter(FormStartControls)')).not.to.be.false;
    expect(tree.subTree('withRouter(FormStartControls)').props.startPage).to.equal('testing');
    expect(tree.subTree('.usa-alert').text()).to.contain('6/12/2017 at');
  });
});
