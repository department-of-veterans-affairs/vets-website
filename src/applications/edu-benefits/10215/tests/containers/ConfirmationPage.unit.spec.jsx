import React from 'react';

import { expect } from 'chai';
// import sinon from 'sinon';
import { Provider } from 'react-redux';
// import { fireEvent, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
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
  // it('should replace h2 with h3 and retain text content', async () => {
  //   const router = {
  //     push: () => {},
  //   };

  //   const wrapper = mount(
  //     <Provider store={mockStore(storeBase)}>
  //       <ConfirmationPage router={router} />
  //     </Provider>,
  //   );

  //   // Ensure h3 is now in the DOM
  //   const h3Element = document.querySelector('.custom-classname h2');
  //   await expect(h3Element).to.exist;
  //   expect(h3Element.textContent).to.equal('Test Heading');

  //   // Ensure h2 is no longer present
  //   const h2Element = document.querySelector('.custom-classname h2');
  //   expect(h2Element).to.not.exist;

  //   wrapper.unmount();
  // });
});
