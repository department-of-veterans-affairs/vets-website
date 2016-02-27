import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import _ from 'lodash';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import ErrorableInput from '../../../../../_health-care/_js/_components/_form-elements/ErrorableInput';

describe('<ErrorableInput>', () => {
  it('ensure value changes propagate', () => {
    let errorableInput;

    let updatePromise = new Promise((resolve, _reject) => {
      errorableInput = ReactTestUtils.renderIntoDocument(
        <ErrorableInput label="test" onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const input = ReactTestUtils.findRenderedDOMComponentWithTag(errorableInput, 'input');
    input.value = "newValue";
    ReactTestUtils.Simulate.change(input);

    expect(updatePromise).to.eventually.equal("newValue");
  });
});

