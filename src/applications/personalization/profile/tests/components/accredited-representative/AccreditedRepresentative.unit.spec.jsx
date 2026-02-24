import React from 'react';
import sinon from 'sinon';

import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as useRepresentativeStatus from 'platform/user/widgets/representative-status/hooks/useRepresentativeStatus';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import mockRepresentativeData from '../../../mock-representative-data.json';
import { formatContactInfo } from '../../../util/formatContactInfo';

import AccreditedRepresentative from '../../../components/accredited-representative/AccreditedRepresentative';

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

const getState = ({ isLOA3 = 1 } = {}) => ({
  user: {
    profile: {
      signIn: { serviceName: CSP_IDS.ID_ME },
      loa: { current: isLOA3 },
    },
  },
});

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
      const { container } = renderWithStoreAndRouter(
        <AccreditedRepresentative />,
        {
          initialState: {
            ...getState(),
          },
        },
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited representative or VSO',
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
      const { container, getByTestId } = renderWithStoreAndRouter(
        <AccreditedRepresentative />,
        {
          initialState: {
            ...getState(),
          },
        },
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited representative or VSO',
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
      const { container, getByTestId, getByText } = renderWithStoreAndRouter(
        <AccreditedRepresentative />,
        {
          initialState: {
            ...getState(),
          },
        },
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited representative or VSO',
      );
      getByTestId('no-rep');
      getByText('You don’t have an accredited representative.');
    });
  });

  context('when isLOA3 is true', () => {
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
      const { container, getByTestId, getByText } = renderWithStoreAndRouter(
        <AccreditedRepresentative />,
        {
          initialState: {
            ...getState({ isLOA3: 3 }),
          },
        },
      );
      expect($('h1', container).textContent).to.eq(
        'Accredited representative or VSO',
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
        const { container, getByTestId, getByText } = renderWithStoreAndRouter(
          <AccreditedRepresentative />,
          {
            initialState: {
              ...getState(),
            },
          },
        );
        expect($('h1', container).textContent).to.eq(
          'Accredited representative or VSO',
        );
        getByTestId('unknown-rep');
        getByText('We can’t check if you have an accredited representative.');
      });
    },
  );
});
