import React from 'react';
import { expect } from 'chai';
// import sinon from 'sinon';
import { Provider } from 'react-redux';
// import { fireEvent, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import ConfirmationPage from '../../containers/ConfirmationPage';

const storeBase = {
  form: {
    submission: {
      timestamp: '2024-01-02T03:04:05.067Z',
      response: {
        confirmationNumber: '123123123',
        pdfUrl: '',
      },
    },
    data: {
      institutionName: 'Doe University',
      facilityCode: '12345',
      termStartDate: '2000-11-26',
      dateOfCalculations: '2021-11-26',
    },
  },
};

describe('<ConfirmationPage>', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  it('should render with data', () => {
    const router = {
      push: () => {},
    };
    const wrapper = shallow(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage router={router} />
      </Provider>,
    );
    expect(wrapper.find('ConfirmationPage').exists()).to.be.true;
    wrapper.unmount();
  });
  // it('should print the page', () => {
  //   const printSpy = sinon.spy(window, 'print');
  //   const router = {
  //     push: () => {},
  //   };
  //   const wrapper = shallow(
  //     <Provider store={mockStore(storeBase)}>
  //       <ConfirmationPage router={router} />
  //     </Provider>,
  //   );
  //   const printButton = wrapper.find('[data-testid="print-page"]');
  //  fireEvent.click(printButton);
  //   expect(printSpy.calledOnce).to.be.true;
  //   printSpy.restore();
  //   wrapper.unmount();

  // const { getByTestId } = render(
  //   <Provider store={mockStore(storeBase)}>
  //     <ConfirmationPage router={router} />
  //   </Provider>,
  // );
  // expect(getByTestId('print-page')).to.exist;
  // fireEvent.click(getByTestId('print-page'));
  // expect(printSpy.calledOnce).to.be.true;
  // printSpy.restore();
  // });
});
