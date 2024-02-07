import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import RemoveCompareSelectedModal from '../../components/RemoveCompareSelectedModal';

describe('<RemoveCompareSelectedModal/>', () => {
  it('should render', () => {
    const wrapper = shallow(<RemoveCompareSelectedModal />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should render jsx ', () => {
    const wrapper = shallow(
      <RemoveCompareSelectedModal onClose name="name" onRemove />,
    );
    expect(wrapper.find('p').text()).to.equal(
      'Do you want to remove name from your comparison?',
    );
    wrapper.unmount();
  });
  it('should call onClose when the modal is closed', () => {
    const onCloseMock = sinon.spy();
    const wrapper = shallow(
      <RemoveCompareSelectedModal
        name="Institution Name"
        onClose={onCloseMock}
        onRemove={() => {}}
        onCancel={() => {}}
      />,
    );

    wrapper.find(VaModal).prop('onCloseEvent')();
    expect(onCloseMock.called).to.be.true;
    wrapper.unmount();
  });
});
