import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import FormButtons from '../../components/FormButtons';

describe('VAOS <FormButtons>', () => {
  it('should render', () => {
    const tree = shallow(<FormButtons onBack={f => f} />);

    expect(tree.find('ProgressButton').length).to.equal(1);
    expect(tree.find('LoadingButton').props().isLoading).not.to.be.true;

    tree.unmount();
  });
  it('should set loading state', () => {
    const tree = shallow(<FormButtons onBack={f => f} pageChangeInProgress />);

    expect(tree.find('ProgressButton').length).to.equal(1);
    expect(tree.find('LoadingButton').props().isLoading).to.be.true;

    tree.unmount();
  });
  it('should call onBack prop', () => {
    const goBack = sinon.spy();

    const tree = shallow(<FormButtons onBack={goBack} pageChangeInProgress />);

    tree
      .find('ProgressButton')
      .props()
      .onButtonClick();

    expect(goBack.called).to.be.true;

    tree.unmount();
  });
});
