import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as helpers from '../../../helpers';
import SupplementaryFormsSection from '../../../components/SupplementaryFormsSection';

describe('<SupplementaryFormsSection />', () => {
  let mailingAddressStub;
  let supportingDocsStub;
  let getIncompleteOwnedAssetsStub;

  beforeEach(() => {
    mailingAddressStub = sinon
      .stub(require('../../../components/MailingAddress'), 'default')
      .callsFake(() => <div data-testid="mailing-address" />);

    supportingDocsStub = sinon
      .stub(
        require('../../../components/OwnedAssetsDescriptions'),
        'SupportingDocumentsNeededList',
      )
      .callsFake(() => <div data-testid="supporting-docs-list" />);
    getIncompleteOwnedAssetsStub = sinon.stub(
      helpers,
      'getIncompleteOwnedAssets',
    );
  });

  afterEach(() => {
    mailingAddressStub.restore();
    supportingDocsStub.restore();
    getIncompleteOwnedAssetsStub.restore();
  });

  context('when there are no alertable assets and no trusts', () => {
    it('does not render the section', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [],
        hasFarm: false,
        hasBusiness: false,
      });

      const { container } = render(<SupplementaryFormsSection formData={{}} />);

      expect(container.querySelector('section')).to.not.exist;
    });
  });

  context('when both BUSINESS and FARM assets and TRUSTS are present', () => {
    it('renders business and farm and trust mailing instructions and links', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: true,
        hasBusiness: true,
      });

      const { container, getByText } = render(
        <SupplementaryFormsSection
          formData={{
            trusts: [{ 'view:addFormQuestion': false }],
            ownedAssets: [{}],
          }}
        />,
      );

      getByText(/Report of Income from Property or Business/i);
      getByText(/Questionnaire for Farm Income/i);
      getByText(/supporting documents for a trust/i);

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');

      expect(links).to.have.length(2);
      expect(links[0].getAttribute('text')).to.include('21P-4185');
      expect(links[1].getAttribute('text')).to.include('21P-4165');

      expect(container.querySelector('va-additional-info')).to.exist;
    });
  });

  context('when both BUSINESS and TRUST assets are present', () => {
    it('renders business and farm mailing instructions and links', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: false,
        hasBusiness: true,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection
          formData={{
            trusts: [{ 'view:addFormQuestion': false }],
            ownedAssets: [{}],
          }}
        />,
      );

      getByText(/Report of Income from Property or Business/i);
      getByText(/supporting documents for a trust/i);

      expect(queryByText(/Questionnaire for Farm Income/i)).to.not.exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');

      expect(links).to.have.length(1);
      expect(links[0].getAttribute('text')).to.include('21P-4185');

      expect(container.querySelector('va-additional-info')).to.exist;
    });
  });

  context('when both FARM and TRUST assets are present', () => {
    it('renders business and farm mailing instructions and links', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: true,
        hasBusiness: false,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection
          formData={{
            trusts: [{ 'view:addFormQuestion': false }],
            ownedAssets: [{}],
          }}
        />,
      );

      getByText(/Questionnaire for Farm Income/i);
      getByText(/supporting documents for a trust/i);

      expect(queryByText(/Report of Income from Property or Business/i)).to.not
        .exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');

      expect(links).to.have.length(1);
      expect(links[0].getAttribute('text')).to.include('21P-4165');

      expect(container.querySelector('va-additional-info')).to.exist;
    });
  });

  context('when both BUSINESS and FARM assets are present', () => {
    it('renders business and farm mailing instructions and links', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: true,
        hasBusiness: true,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection formData={{ ownedAssets: [{}] }} />,
      );

      getByText(/Report of Income from Property or Business/i);
      getByText(/Questionnaire for Farm Income/i);

      expect(queryByText(/supporting documents for a trust/i)).to.not.exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');

      expect(links).to.have.length(2);
      expect(links[0].getAttribute('text')).to.include('21P-4185');
      expect(links[1].getAttribute('text')).to.include('21P-4165');

      expect(container.querySelector('va-additional-info')).to.not.exist;
    });
  });

  context('when only BUSINESS assets are present', () => {
    it('renders business-only instructions and link', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: false,
        hasBusiness: true,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection formData={{ ownedAssets: [{}] }} />,
      );

      getByText(/Report of Income from Property or Business/i);

      expect(queryByText(/Questionnaire for Farm Income/i)).to.not.exist;
      expect(queryByText(/supporting documents for a trust/i)).to.not.exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');
      expect(links).to.have.length(1);
      expect(links[0].getAttribute('text')).to.include('21P-4185');

      expect(container.querySelector('va-additional-info')).to.not.exist;
    });
  });

  context('when only FARM assets are present', () => {
    it('renders farm-only instructions and link', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [{}],
        hasFarm: true,
        hasBusiness: false,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection formData={{ ownedAssets: [{}] }} />,
      );

      getByText(/Questionnaire for Farm Income/i);

      expect(queryByText(/Report of Income from Property or Business/i)).to.not
        .exist;
      expect(queryByText(/supporting documents for a trust/i)).to.not.exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');
      expect(links).to.have.length(1);
      expect(links[0].getAttribute('text')).to.include('21P-4165');

      expect(container.querySelector('va-additional-info')).to.not.exist;
    });
  });

  context('when only TRUST are present', () => {
    it('renders trust mailing instructions and supporting docs info', () => {
      getIncompleteOwnedAssetsStub.returns({
        alertAssets: [],
        hasFarm: false,
        hasBusiness: false,
      });

      const { container, getByText, queryByText } = render(
        <SupplementaryFormsSection
          formData={{ trusts: [{ 'view:addFormQuestion': false }] }}
        />,
      );

      getByText(/supporting documents for a trust/i);

      expect(queryByText(/Report of Income from Property or Business/i)).to.not
        .exist;
      expect(queryByText(/Questionnaire for Farm Income/i)).to.not.exist;

      const mailingAddress = container.querySelector(
        '[data-testid="mailing-address"]',
      );
      expect(mailingAddress).to.exist;

      const links = container.querySelectorAll('va-link');
      expect(links).to.have.length(0);

      expect(container.querySelector('va-additional-info')).to.exist;
    });
  });
});
