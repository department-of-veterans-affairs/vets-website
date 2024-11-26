import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SelectedAccreditedRepresentativeReview from '../../../components/SelectAccreditedRepresentativeReview';
import repResults from '../../fixtures/data/representative-results.json';

describe('<SelectAccreditedRepresentativeReview>', () => {
  const getProps = () => {
    return {
      props: {
        data: {
          'view:selectedRepresentative': repResults[0].data,
        },
      },
      mockStore: {
        getState: () => ({
          data: {
            'view:selectedRepresentative': repResults[0].data,
          },
        }),
        subscribe: () => {},
      },
    };
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <SelectedAccreditedRepresentativeReview {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
