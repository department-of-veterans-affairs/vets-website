import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';
import FilterBeforeResults from '../../../containers/search/FilterBeforeResults';
import reducer from '../../../reducers';

const commonStore = createCommonStore(reducer);

describe('<FilterBeforeResults>', () => {
  it('should render', () => {
    const tree = shallow(
      <Provider store={commonStore}>
        <FilterBeforeResults />
      </Provider>,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
