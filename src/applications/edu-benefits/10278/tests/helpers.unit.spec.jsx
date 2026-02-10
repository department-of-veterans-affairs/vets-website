import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import {
  getFullName,
  organizationRepresentativesArrayOptions,
  getThirdPartyName,
  buildValidateAtLeastOne,
  validateOtherText,
  InformationToDiscloseReviewField,
  ClaimInformationDescription,
} from '../helpers';

describe('10278 helpers - getThirdPartyName', () => {
  it('returns organization name when authorize is "organization"', () => {
    const formData = {
      discloseInformation: { authorize: 'organization' },
      organizationName: 'Acme Org',
    };

    expect(getThirdPartyName(formData)).to.equal('Acme Org');
  });

  it('returns person full name when authorize is "person"', () => {
    const formData = {
      discloseInformation: { authorize: 'person' },
      thirdPartyPersonName: {
        fullName: {
          first: 'Jane',
          last: 'Doe',
        },
      },
    };

    expect(getThirdPartyName(formData)).to.equal('Jane Doe');
  });
});

describe('10278 helpers - buildValidateAtLeastOne', () => {
  it('adds error on the anchor key when none are checked', () => {
    const anchorAddError = sinon.spy();
    const rootAddError = sinon.spy();
    const errors = {
      status: { addError: anchorAddError },
      addError: rootAddError,
    };

    const validate = buildValidateAtLeastOne(['status', 'other']);
    validate(errors, { status: false, other: false });

    expect(anchorAddError.calledWith('You must provide an answer')).to.equal(
      true,
    );
    expect(rootAddError.called).to.equal(false);
  });

  it('falls back to root addError when anchor path is missing', () => {
    const rootAddError = sinon.spy();
    const errors = { addError: rootAddError };

    const validate = buildValidateAtLeastOne(['status', 'other']);
    validate(errors, { status: false, other: false });

    expect(rootAddError.calledWith('You must provide an answer')).to.equal(
      true,
    );
  });

  it('does nothing when at least one checkbox is checked', () => {
    const anchorAddError = sinon.spy();
    const rootAddError = sinon.spy();
    const errors = {
      status: { addError: anchorAddError },
      addError: rootAddError,
    };

    const validate = buildValidateAtLeastOne(['status', 'other']);
    validate(errors, { status: true, other: false });

    expect(anchorAddError.called).to.equal(false);
    expect(rootAddError.called).to.equal(false);
  });
});

describe('10278 helpers - validateOtherText', () => {
  it('adds error when other is checked and otherText is empty', () => {
    const otherTextAddError = sinon.spy();
    const rootAddError = sinon.spy();
    const errors = {
      otherText: { addError: otherTextAddError },
      addError: rootAddError,
    };

    validateOtherText(errors, { other: true, otherText: '   ' });

    expect(otherTextAddError.calledWith('Enter other information')).to.equal(
      true,
    );
    expect(rootAddError.called).to.equal(false);
  });

  it('falls back to root addError when otherText path is missing', () => {
    const rootAddError = sinon.spy();
    const errors = { addError: rootAddError };

    validateOtherText(errors, { other: true, otherText: '' });

    expect(rootAddError.calledWith('Enter other information')).to.equal(true);
  });

  it('does nothing when other is not checked', () => {
    const otherTextAddError = sinon.spy();
    const rootAddError = sinon.spy();
    const errors = {
      otherText: { addError: otherTextAddError },
      addError: rootAddError,
    };

    validateOtherText(errors, { other: false, otherText: '' });

    expect(otherTextAddError.called).to.equal(false);
    expect(rootAddError.called).to.equal(false);
  });
});

describe('10278 helpers - InformationToDiscloseReviewField', () => {
  it('renders selected values and other text', () => {
    const disclosureKeys = ['status', 'other'];
    const options = {
      status: 'Status',
      other: { title: 'Other' },
    };
    const formData = {
      claimInformation: {
        status: true,
        other: true,
        otherText: 'Custom details',
      },
    };

    const { getByText } = render(
      <InformationToDiscloseReviewField
        disclosureKeys={disclosureKeys}
        options={options}
        dataKey="claimInformation"
        otherTextKey="otherText"
      >
        <div formData={formData} />
      </InformationToDiscloseReviewField>,
    );

    expect(getByText('Status')).to.exist;
    expect(getByText('Other')).to.exist;
    expect(getByText('Selected')).to.exist;
    expect(getByText('Custom details')).to.exist;
  });
});

describe('10278 helpers - ClaimInformationDescription', () => {
  it('renders minor key with special label', () => {
    const formData = {
      claimInformation: { minor: true },
    };

    const { getByText } = render(
      <ClaimInformationDescription formData={formData} />,
    );

    expect(
      getByText('Change of address or direct deposit (minor claimants only)'),
    ).to.exist;
  });

  it('renders other key with otherText value', () => {
    const formData = {
      claimInformation: { other: true, otherText: 'Custom reason' },
    };

    const { getByText } = render(
      <ClaimInformationDescription formData={formData} />,
    );

    expect(getByText('Other: Custom reason')).to.exist;
  });

  it('renders regular keys with DISCLOSURE_OPTIONS labels', () => {
    const formData = {
      claimInformation: { statusOfClaim: true, paymentHistory: true },
    };

    const { getByText } = render(
      <ClaimInformationDescription formData={formData} />,
    );

    expect(getByText('Status of pending claim or appeal')).to.exist;
    expect(getByText('Payment history')).to.exist;
  });
});

describe('organizationRepresentativesArrayOptions helpers', () => {
  describe('getFullName', () => {
    it('should return null when fullName is missing', () => {
      expect(getFullName()).to.equal(null);
      expect(getFullName(null)).to.equal(null);
    });

    it('should return "First Last" when middle name is missing', () => {
      const fullName = { first: 'John', last: 'Doe' };
      expect(getFullName(fullName)).to.equal('John Doe');
    });

    it('should return "First Middle Last" when all parts exist', () => {
      const fullName = { first: 'John', middle: 'Q', last: 'Doe' };
      expect(getFullName(fullName)).to.equal('John Q Doe');
    });

    it('should trim extra whitespace and ignore blank strings', () => {
      const fullName = { first: '  John  ', middle: '   ', last: '  Doe ' };
      expect(getFullName(fullName)).to.equal('John Doe');
    });

    it('should return empty string when all name parts are empty', () => {
      const fullName = { first: '', middle: '', last: '' };
      expect(getFullName(fullName)).to.equal('');
    });
  });

  describe('organizationRepresentativesArrayOptions', () => {
    it('should define required array builder options correctly', () => {
      expect(organizationRepresentativesArrayOptions.arrayPath).to.equal(
        'organizationRepresentatives',
      );
      expect(organizationRepresentativesArrayOptions.nounSingular).to.equal(
        'representative',
      );
      expect(organizationRepresentativesArrayOptions.nounPlural).to.equal(
        'representatives',
      );
      expect(organizationRepresentativesArrayOptions.required).to.equal(true);
    });

    it('should mark item incomplete when first or last name is missing', () => {
      const incompleteNoFirst = { fullName: { last: 'Doe' } };
      const incompleteNoLast = { fullName: { first: 'John' } };
      const incompleteMissingFullName = {};

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteNoFirst,
        ),
      ).to.equal(true);

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteNoLast,
        ),
      ).to.equal(true);

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(
          incompleteMissingFullName,
        ),
      ).to.equal(true);
    });

    it('should mark item complete when first and last name exist', () => {
      const complete = { fullName: { first: 'John', last: 'Doe' } };

      expect(
        organizationRepresentativesArrayOptions.isItemIncomplete(complete),
      ).to.equal(false);
    });

    it('should return the correct cancel button text', () => {
      expect(
        organizationRepresentativesArrayOptions.text.cancelAddButtonText(),
      ).to.equal('Cancel adding this individual’s information');

      expect(
        organizationRepresentativesArrayOptions.text.cancelEditButtonText(),
      ).to.equal('Cancel editing this individual’s information');
    });

    it('should return full name via getItemName', () => {
      const item = { fullName: { first: 'Jane', middle: 'A', last: 'Smith' } };
      expect(
        organizationRepresentativesArrayOptions.text.getItemName(item),
      ).to.equal('Jane A Smith');
    });

    it('should return null via getItemName when fullName is missing', () => {
      const item = {};
      expect(
        organizationRepresentativesArrayOptions.text.getItemName(item),
      ).to.equal(null);
    });

    it('should use organizationName from fullData for cardDescription', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      const fullData = { organizationName: 'Acme Corp' };

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          fullData,
        ),
      ).to.equal('Acme Corp');
    });

    it('should return empty string for cardDescription when organizationName is missing', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          {},
        ),
      ).to.equal('');

      expect(
        organizationRepresentativesArrayOptions.text.cardDescription(
          item,
          0,
          null,
        ),
      ).to.equal('');
    });

    it('should have the correct summaryTitle', () => {
      expect(
        organizationRepresentativesArrayOptions.text.summaryTitle,
      ).to.equal('Review the names of organization’s representatives');
    });
  });
});
