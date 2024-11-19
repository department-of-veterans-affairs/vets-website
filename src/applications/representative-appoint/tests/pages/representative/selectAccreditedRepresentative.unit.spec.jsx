import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import {
  render,
  waitFor,
  fireEvent,
  getByTestId,
} from '@testing-library/react';
import sinon from 'sinon';
import { SelectAccreditedRepresentative } from '../../../components/SelectAccreditedRepresentative';
import * as api from '../../../api/fetchRepStatus';
import repResults from '../../fixtures/data/representative-results.json';

describe('<SelectAccreditedRepresentative>', () => {
  const getProps = ({ submitted = false, setFormData = () => {} } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },
        formData: { 'view:representativeSearchResults': repResults },
        setFormData,
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:representativeSearchResults': repResults },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <SelectAccreditedRepresentative {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should call getRepStatus and update state accordingly', async () => {
    const { props, mockStore } = getProps();

    const fetchRepStatusStub = sinon.stub(api, 'fetchRepStatus').resolves({
      data: { status: 'active' },
    });

    const setFormDataSpy = sinon.spy(props, 'setFormData');

    const { container } = render(
      <Provider store={mockStore}>
        <SelectAccreditedRepresentative {...props} />
      </Provider>,
    );

    const selectRepButton = getByTestId(container, 'rep-select-19731'); // YEAH

    expect(selectRepButton).to.exist;

    fireEvent.click(selectRepButton);

    await waitFor(() => {
      expect(fetchRepStatusStub.calledOnce).to.be.true;
      expect(setFormDataSpy.called).to.be.true;
      expect(setFormDataSpy.args[0][0]).to.include({
        'view:selectedRepresentative': repResults[0].data,
      });
    });

    fetchRepStatusStub.restore();
    setFormDataSpy.restore();
  });
});
