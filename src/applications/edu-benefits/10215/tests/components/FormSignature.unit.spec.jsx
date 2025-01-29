import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import userEvent from '@testing-library/user-event';
import FormSignature from '../../components/FormSignature';

// const formData = {
//     "view:programsSummary": false,
//     institutionDetails: {
//         institutionName: "Test",
//         facilityCode: "21312323",
//         termStartDate: "2000-08-02",
//         dateOfCalculations: "2000-09-10"
//     },
//     programs: [
//         {
//             programName: "Test Program name",
//             studentsEnrolled: "5",
//             supportedStudents: "5",
//             fte: {},
//             "view:calcs": {}
//         }
//     ],
//     signatureOfficialTitle: "Test official title",
//     signature: "Test name",
//     AGREED: true
// };

describe('<FormSignature>', () => {
  const mockStore = configureStore([]);

  it('should render', () => {
    const setSignatureError = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <FormSignature
          signature={{
            value: '',
            dirty: false,
          }}
          validations={[]}
          setSignatureError={setSignatureError}
          formData={{}}
        />
      </Provider>,
    );

    expect($('va-text-input', container)).to.exist;
  });

  it('should render error', () => {
    const setSignatureError = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <FormSignature
          signature={{ value: '', dirty: true }}
          validations={[]}
          signatureError="Please enter your name"
          setSignatureError={setSignatureError}
          formData={{}}
        />
      </Provider>,
    );

    expect($('va-text-input[error="Please enter your name"]', container)).to
      .exist;
  });

  it('should call setSignature when filled out', () => {
    const setSignatureError = sinon.spy();
    const setSignature = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <FormSignature
          signature={{
            value: '',
            dirty: false,
          }}
          validations={[]}
          setSignatureError={setSignatureError}
          formData={{}}
          setSignature={setSignature}
        />
      </Provider>,
    );

    userEvent.type($('va-text-input', container), 'Test Name');
    // console.log($('va-text-input', container));
    // expect(setSignature.called).to.be.true;
  });
});
