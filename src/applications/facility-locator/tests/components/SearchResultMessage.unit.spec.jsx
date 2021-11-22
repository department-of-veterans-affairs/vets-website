import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchResultMessage from '../../components/SearchResultMessage';
import { Error } from '../../constants';

describe('SearchResultMessage', () => {
  it('Should render SearchResultMessage with location error message', () => {
    const wrapper = shallow(
      <SearchResultMessage
        facilityType={'health'}
        resultRef={React.createRef()}
        message={Error.LOCATION}
        error={{ type: 'mapBox' }}
      />,
    );
    expect(wrapper.find('Alert').prop('description')).to.equal(Error.LOCATION);
    wrapper.unmount();
  });

  it('Should render SearchResultMessage with Default error message', () => {
    const wrapper = shallow(
      <SearchResultMessage
        facilityType={'benefits'}
        resultRef={React.createRef()}
        message={Error.DEFAULT}
        error={[{ code: 503 }]}
      />,
    );
    expect(wrapper.find('Alert').prop('description')).to.equal(Error.DEFAULT);
    wrapper.unmount();
  });
});
