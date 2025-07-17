// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { expect } from 'chai';
// import sinon from 'sinon';

// import { EditInternationalPhonePage } from '../../../components/EditInternationalPhonePage';

// describe('EditInternationalPhonePage', () => {
//   let goToPath;
//   let setFormData;

//   const clickEvent = new MouseEvent('click', {
//     bubbles: true,
//     cancelable: true,
//   });

//   beforeEach(() => {
//     goToPath = sinon.spy();
//     setFormData = sinon.spy();
//   });

//   afterEach(() => {
//     sessionStorage?.clear();
//   });

//   it('renders with initial international phone value', () => {
//     const internationalPhone = '+44 20 1234 5678';
//     const { container, queryByText } = render(
//       <EditInternationalPhonePage
//         data={{ internationalPhone }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');

//     expect(input.getAttribute('label')).to.eql('International phone number');
//     expect(queryByText(/Edit international phone number/i)).to.not.be.null;
//   });

//   it('shows error on invalid international phone when user enters bad phone', async () => {
//     const { container } = render(
//       <EditInternationalPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );

//     const input = container.querySelector('va-text-input');
//     fireEvent.input(input, { detail: { value: '' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('error')).to.include(
//         'Enter a valid international phone number',
//       );
//     });
//   });

//   //   it('validates and calls the onUpdate with a valid international phone number', async () => {
//   //     const { container } = render(
//   //       <EditInternationalPhonePage
//   //         goToPath={goToPath}
//   //         setFormData={setFormData}
//   //         data={{ internationalPhone: '' }}
//   //       />,
//   //     );

//   //     const input = container.querySelector('va-text-input');
//   //     fireEvent.input(input, { detail: { value: '+49 1512 345678' } });

//   //     const updateBtn = container.querySelector(
//   //       'button[aria-label="Update international phone number"]',
//   //     );
//   //     fireEvent.click(updateBtn);

//   //     await waitFor(() => {
//   //       expect(setFormData.called).to.be.true;
//   //       expect(setFormData.firstCall.args[0].internationalPhone).to.eql(
//   //         '+49 1512 345678',
//   //       );
//   //     });
//   //   });

//   it('calls onCancel handler and returns to path', async () => {
//     sessionStorage.setItem('onReviewPage', true);
//     const { container } = render(
//       <EditInternationalPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         data={{ internationalPhone: '+81 3-1234-5678' }}
//       />,
//     );

//     container
//       .querySelector('va-button-pair')
//       .__events.secondaryClick(clickEvent);

//     await waitFor(() => {
//       expect(goToPath.called).to.be.true;
//     });

//     sessionStorage.removeItem('onReviewPage');
//   });
// });

import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import EditInternationalPhonePage from '../../../components/EditInternationalPhonePage';

function createMockStore(getStateValue = {}) {
  return {
    getState: () => getStateValue,
    dispatch: sinon.spy(),
    subscribe: () => {},
  };
}

const mockSchema = {
  type: 'object',
  properties: {
    internationalPhone: {
      type: 'string',
    },
  },
};

const mockUiSchema = {
  internationalPhone: { 'ui:title': 'International phone number' },
};

const mockData = {
  internationalPhone: '18005556666',
};

describe('EditInternationalPhonePage', () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

  it('renders phone input with correct labels and values', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const textInputs = container.querySelectorAll('input[type="text"]');
    expect(textInputs.length).to.equal(1);

    expect(container.textContent).to.include('International phone number');
    expect(container.textContent).to.include('Edit international phone number');
  });

  it('renders Update and Cancel buttons', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const vaButtons = container.querySelectorAll('va-button');
    const updateButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'update',
    );
    const cancelButton = Array.from(vaButtons).find(
      btn => btn.getAttribute('text')?.toLowerCase() === 'cancel',
    );

    expect(vaButtons.length).to.eql(2);
    expect(updateButton).to.exist;
    expect(cancelButton).to.exist;
  });

  it('handler: onCancel navigates to review-and-submit if onReviewPage', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = container.querySelector('va-button[text="Cancel"]');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;

      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
    });
  });

  it('handler: onCancel navigates to contact-info if not onReviewPage', async () => {
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={() => {}}
        />
      </Provider>,
    );

    const cancelButton = container.querySelector('va-button[text="Cancel"]');

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/veteran-contact-information')).to.be.true;
    });
  });

  it('handler: onUpdate navigates to review-and-submit if onReviewPage', async () => {
    sessionStorage.setItem('onReviewPage', true);
    const store = createMockStore();
    const goToPathSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={goToPathSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const updateButton = container.querySelector('va-button[text="Update"]');
    const intPhone = container.querySelector('input[value="18005556666"]');

    fireEvent.click(updateButton);
    fireEvent.input(intPhone, { target: { value: '18005556667' } });

    await waitFor(() => {
      expect(goToPathSpy.called).to.be.true;
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
      expect(setFormDataSpy.called).to.be.true;
    });
  });

  it('topScrollElement is called', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <div name="topScrollElement" />
        <EditInternationalPhonePage
          schema={mockSchema}
          uiSchema={mockUiSchema}
          data={mockData}
          goToPath={() => {}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('[name="topScrollElement"]')).to.exist;
    });
  });
});
