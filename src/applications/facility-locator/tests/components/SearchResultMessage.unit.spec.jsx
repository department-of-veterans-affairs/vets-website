import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchResultMessage from '../../components/SearchResultMessage';
import { Error } from '../../constants';

xdescribe('SearchResultMessage', () => {
  it('Should render SearchResultMessage with location error message', () => {
    const wrapper = shallow(
      <SearchResultMessage
        facilityType={'health'}
        resultRef={React.createRef()}
        message={Error.LOCATION}
        error={{ type: 'mapBox' }}
      />,
    );
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal(Error.LOCATION);
    expect(wrapper).to.matchSnapshot();
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
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal(Error.DEFAULT);
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render SearchResultMessage with no results message', () => {
    const wrapper = shallow(
      <SearchResultMessage
        facilityType={'urgent_care'}
        resultRef={React.createRef()}
        resultsFound={false}
        error={[{ code: 503 }]}
      />,
    );
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render SearchResultMessage init', () => {
    const wrapper = shallow(<SearchResultMessage />);
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
