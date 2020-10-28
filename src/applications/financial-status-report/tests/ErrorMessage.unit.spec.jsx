import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import ErrorMessage from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render AlertBox', () => {
    const fakeStore = {
      getState: () => ({
        fsr: {
          errorCode: 'FSR_SERVER_ERROR',
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const errorMessage = mount(<ErrorMessage store={fakeStore} />);
    const alertBox = errorMessage.find('AlertBox');
    expect(alertBox).not.to.be.undefined;
    errorMessage.unmount();
  });
});
