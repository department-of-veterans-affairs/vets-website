import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SelectedAccreditedRepresentativeReview from '../../../components/SelectAccreditedRepresentativeReview';
import repResults from '../../fixtures/data/representative-results.json';
import orgResult from '../../fixtures/data/organization-type.json';

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

  const renderContainer = (props, mockStore) => {
    const { container } = render(
      <Provider store={mockStore}>
        <SelectedAccreditedRepresentativeReview {...props} />
      </Provider>,
    );

    return container;
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const container = renderContainer(props, mockStore);

    expect(container).to.exist;
  });

  it('should display review-row when orgName is present', () => {
    const { props, mockStore } = getProps();

    const container = renderContainer(props, mockStore);

    const reviewRow = container.querySelector('.review-row');
    expect(reviewRow).to.not.be.null;
  });

  it('should render org for org type', () => {
    const { mockStore } = getProps();

    const props = {
      data: {
        'view:selectedRepresentative': orgResult,
      },
    };

    const container = renderContainer(props, mockStore);

    const ddElement = Array.from(container.querySelectorAll('dd')).find(
      dd => dd.textContent === 'Organization',
    );

    expect(ddElement).to.not.be.null;
    expect(ddElement).to.have.text('Organization');
  });
});
