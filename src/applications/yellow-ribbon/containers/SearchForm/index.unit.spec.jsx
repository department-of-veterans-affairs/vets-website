// Dependencies.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
// Relative imports.
import { SearchForm } from '.';
import { TOOL_TIP_LABEL, TOOL_TIP_CONTENT } from '../../constants';

describe('Yellow Ribbon container <SearchForm>', () => {
  it('should render', () => {
    const tree = mount(<SearchForm />);
    const select = tree.find('select');
    const input = tree.find('input');
    const AdditionalInfoComponent = tree.find('va-additional-info');
    const checkbox = tree.find('va-checkbox');
    // open additional info tip
    tree.find('va-additional-info').simulate('click');
    expect(select.length).to.be.equal(1);
    expect(input.length).to.be.equal(2);
    expect(checkbox.length).to.be.equal(2);
    expect(AdditionalInfoComponent.html()).to.include(TOOL_TIP_LABEL);
    expect(AdditionalInfoComponent.html()).to.include(TOOL_TIP_CONTENT);
    tree.unmount();
  });

  it('fetches data on mount', () => {
    const oldWindow = global.window;

    global.window = {
      location: {
        search:
          '?contributionAmount=unlimited&city=boulder&name=university&numberOfStudents=unlimited&state=co',
      },
    };

    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(
      fetchResultsThunk.firstCall.calledWith({
        city: 'boulder',
        contributionAmount: 'unlimited',
        name: 'university',
        numberOfStudents: 'unlimited',
        state: 'co',
      }),
    ).to.be.true;
    expect(tree.state().name).to.be.equal('university');

    tree.unmount();

    global.window = oldWindow;
  });

  it('updates the name in state', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input[name="yr-search-name"]');

    input.simulate('change', { target: { value: 'new value' } });

    expect(tree.state().name).to.be.equal('new value');

    tree.unmount();
  });

  it('fetches data on submit', () => {
    const fetchResultsThunk = sinon.stub();
    const tree = shallow(<SearchForm fetchResultsThunk={fetchResultsThunk} />);

    tree.setState({ name: 'testing' });

    const form = tree.find('form');
    const preventDefault = sinon.stub();

    form.simulate('submit', { preventDefault });

    expect(fetchResultsThunk.calledOnce).to.be.true;
    expect(preventDefault.calledOnce).to.be.true;

    tree.unmount();
  });
});
