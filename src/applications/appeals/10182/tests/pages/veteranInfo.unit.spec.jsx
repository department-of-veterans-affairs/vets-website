import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import veteranInformation from '../../pages/veteranInfo';

describe('Confirm Veteran Details', () => {
  it('should render Veteran details', () => {
    const tree = shallow(
      <DefinitionTester
        definitions={{}}
        schema={veteranInformation.schema}
        uiSchema={veteranInformation.uiSchema}
        data={{}}
        formData={{}}
        setFormData={f => f}
      />,
    );
    expect(tree.find('Connect(VeteranInformation)')).to.exist;
    tree.unmount();
  });
});
