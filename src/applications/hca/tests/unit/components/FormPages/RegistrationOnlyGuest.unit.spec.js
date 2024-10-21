import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import RegistrationOnlyGuest from '../../../../components/FormPages/RegistrationOnlyGuest';

describe('hca Registration-Only page for guest users', () => {
  const getData = () => ({
    mockStore: {
      getState: () => ({
        user: { login: { currentlyLoggedIn: false } },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
    props: { goBack: sinon.spy() },
  });
  const subject = () => {
    const { mockStore, props } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <RegistrationOnlyGuest {...props} />
      </Provider>,
    );
    const selectors = () => ({
      btnBack: container.querySelector('.usa-button-secondary'),
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors, props };
  };

  it('should render `va-alert` with the correct status', () => {
    const { selectors } = subject();
    const { vaAlert } = selectors();
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'info');
  });

  it('should render correct navigation button(s)', () => {
    const { selectors } = subject();
    const { btnBack } = selectors();
    expect(btnBack).to.exist;
  });

  it('should call the `goBack` prop when the `Back` button is clicked', () => {
    const { selectors, props } = subject();
    const { btnBack } = selectors();
    fireEvent.click(btnBack);
    expect(props.goBack.called).to.be.true;
  });
});
