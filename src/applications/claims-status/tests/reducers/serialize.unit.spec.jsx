import { expect } from 'chai';

import { serializeClaim } from '../../reducers/serialize';
import data from './serialize-example.json';

describe('Claim Serializer', () => {
  it('should return the original claim when the type is evss_claims', () => {
    const claim = {
      ...data.data,
      type: 'evss_claims',
    };

    const serializedClaim = serializeClaim(claim);

    expect(serializedClaim).to.eql(claim);
  });

  it('should return the original claim when there are no tracked items', () => {
    const claim = {
      id: 1,
      type: 'claim',
      attributes: {
        supportingDocuments: [
          {
            id: 1,
            trackedItemId: null,
            uploadDate: '2010-10-01',
          },
        ],
        trackedItems: [],
      },
    };

    const serializedClaim = serializeClaim(claim);

    expect(serializedClaim).to.eql({
      ...claim,
      attributes: {
        ...claim.attributes,
        supportingDocuments: [
          { ...claim.attributes.supportingDocuments[0], date: '2010-10-01' },
        ],
      },
    });
  });

  it('should set supporting documents and tracked items to empty arrays when data is missing', () => {
    const claim = {
      id: 1,
      type: 'claim',
      attributes: {},
    };
    const serializedClaim = serializeClaim(claim);
    expect(serializedClaim).to.eql({
      ...claim,
      attributes: {
        supportingDocuments: [],
        trackedItems: [],
      },
    });
  });

  it('should return no supporting docs when there is only one and it is associated with a tracked item', () => {
    const claim = {
      id: 1,
      type: 'claim',
      attributes: {
        supportingDocuments: [
          {
            id: 1,
            trackedItemId: 1,
          },
        ],
        trackedItems: [
          {
            id: 1,
          },
        ],
      },
    };

    const serializedClaim = serializeClaim(claim);
    const { supportingDocuments, trackedItems } = serializedClaim.attributes;

    // supportingDocuments should be an empty array now
    expect(supportingDocuments).to.be.empty;

    // The supporting document with id: 1 should now be associated with
    // the trackedItem with id: 1
    expect(trackedItems[0].documents.length).to.equal(1);
    expect(trackedItems[0].documents[0].id).to.equal(1);
  });

  it('should only move supporting documents associated with tracked items', () => {
    const claim = {
      id: 1,
      type: 'claim',
      attributes: {
        supportingDocuments: [
          {
            id: 1,
            trackedItemId: 1,
          },
          {
            id: 2,
            trackedItemId: null,
          },
        ],
        trackedItems: [
          {
            id: 1,
          },
        ],
      },
    };

    const serializedClaim = serializeClaim(claim);
    const { supportingDocuments, trackedItems } = serializedClaim.attributes;

    // Supporting doc with id: 2 should be the only one still in
    // supportingDocuments array
    expect(supportingDocuments.length).to.equal(1);
    expect(supportingDocuments[0].id).to.equal(2);

    // trackedItems.documents should now include the suppporting
    // doc with id: 1
    expect(trackedItems[0].documents.length).to.equal(1);
    expect(trackedItems[0].documents[0].id).to.equal(1);
  });

  it('should associate supporting documents to tracked items correctly', () => {
    const claim = { ...data.data };

    const serializedClaim = serializeClaim(claim);
    const { supportingDocuments, trackedItems } = serializedClaim.attributes;

    // Out of the 6 supporting documents, only 3 should remain
    expect(supportingDocuments.length).to.equal(3);
    expect(supportingDocuments.map(d => d.id).sort()).to.eql([1, 5, 6]);

    // Tracked item with id: 1 should have 1 supporting document
    const trackedItem1 = trackedItems.find(d => d.id === 1);
    expect(trackedItem1.documents.length).to.equal(1);
    expect(trackedItem1.documents[0].id).to.equal(2);

    // Tracked item with id: 2 should have 0 supporting documents
    const trackedItem2 = trackedItems.find(d => d.id === 2);
    expect(trackedItem2.documents).to.be.empty;

    // Tracked item with id: 3 should have 2 supporting documents
    const trackedItem3 = trackedItems.find(d => d.id === 3);
    expect(trackedItem3.documents.length).to.be.equal(2);
    expect(trackedItem3.documents.map(d => d.id).sort()).to.eql([3, 4]);
  });
});
