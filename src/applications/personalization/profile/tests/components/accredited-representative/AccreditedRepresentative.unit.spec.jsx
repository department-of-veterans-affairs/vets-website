import React from 'react';
import sinon from 'sinon';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as useRepresentativeStatus from 'platform/user/widgets/representative-status/hooks/useRepresentativeStatus';
import mockRepresentativeData from '../../../mock-representative-data.json';
import { formatContactInfo } from '../../../util/formatContactInfo';

import AccreditedRepresentative from '../../../components/accredited-representative/AccreditedRepresentative';

const store = createStore(() => ({
  featureToggles: {},
}));

const repData = mockRepresentativeData.data[0];

const { concatAddress, contact, extension, vcfUrl } = formatContactInfo(
  repData.attributes,
);

const stubbedRepresentativeData = {
  id: repData.id,
  poaType: repData.attributes.individualType,
  ...repData.attributes,
  concatAddress,
  contact,
  extension,
  vcfUrl,
};

describe('AccreditedRepresentative', () => {
  context('when accredited representative is loading', () => {
    let repStatus;

    beforeEach(() => {
      repStatus = sinon
        .stub(useRepresentativeStatus, 'useRepresentativeStatus')
        .returns({
          representative: null,
          isLoading: true,
          error: null,
        });
    });

    afterEach(() => {
      repStatus.restore();
    });
    it('should render loading', () => {
      const { container } = render(
        <Provider store={store}>
          <AccreditedRepresentative />
        </Provider>,
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited Representative or VSO',
      );
      const loadingIndicator = $('va-loading-indicator', container);
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.contain(
        'Loading your information...',
      );
    });
  });

  context('when accredited representative exists', () => {
    let repStatus;

    beforeEach(() => {
      repStatus = sinon
        .stub(useRepresentativeStatus, 'useRepresentativeStatus')
        .returns({
          representative: stubbedRepresentativeData,
          isLoading: false,
          error: null,
        });
    });

    afterEach(() => {
      repStatus.restore();
    });
    it('should render CurrentRep', async () => {
      const { container, getByTestId } = render(
        <Provider store={store}>
          <AccreditedRepresentative />
        </Provider>,
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited Representative or VSO',
      );
      const vaCard = $('va-card', container);
      expect(vaCard).to.exist;
      getByTestId('current-rep');
    });
  });

  context('when no error and no accredited representative exists', () => {
    let repStatus;

    beforeEach(() => {
      repStatus = sinon
        .stub(useRepresentativeStatus, 'useRepresentativeStatus')
        .returns({
          representative: null,
          isLoading: false,
          error: null,
        });
    });

    afterEach(() => {
      repStatus.restore();
    });
    it('should render NoRep', async () => {
      const { container, getByTestId, getByText } = render(
        <Provider store={store}>
          <AccreditedRepresentative />
        </Provider>,
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited Representative or VSO',
      );
      getByTestId('no-rep');
      getByText('You don’t have an accredited representative.');
    });
  });

  context(
    'when there is an error and no accredited representative exists',
    () => {
      let repStatus;

      beforeEach(() => {
        repStatus = sinon
          .stub(useRepresentativeStatus, 'useRepresentativeStatus')
          .returns({
            representative: null,
            isLoading: false,
            error: 'there is an error',
          });
      });

      afterEach(() => {
        repStatus.restore();
      });
      it('should render UnknownRep', async () => {
        const { container, getByTestId, getByText } = render(
          <Provider store={store}>
            <AccreditedRepresentative />
          </Provider>,
        );
        expect($('h1', container).textContent).to.eq(
          'Accredited Representative or VSO',
        );
        getByTestId('unknown-rep');
        getByText('We can’t check if you have an accredited representative.');
      });
    },
  );
});
