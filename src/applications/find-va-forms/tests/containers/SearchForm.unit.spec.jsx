import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { SearchForm } from '../../containers/SearchForm';

describe('Find VA Forms <SearchForm>', () => {
  it('should render', () => {
    const query = 'query';
    const updateQuery = sinon.spy();

    const tree = shallow(
      <SearchForm query={query} updateQuery={updateQuery} />,
    );
    const input = tree.find('input[name="va-form-query"]');

    expect(input.prop('value')).to.be.equal(query);

    const newQuery = 'new query';
    input.simulate('change', { target: { value: newQuery } });

    expect(updateQuery.calledWith(newQuery)).to.be.true;
    tree.unmount();
  });
});
