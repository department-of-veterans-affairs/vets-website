import set from 'platform/utilities/data/set';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
} from '../actions/types';
import { serializeClaim } from './serialize';

// NOTE: I think that in the long term it will make sense to move
// this logic into the backend, but doing it here for now makes it
// easier to modify this in the short term
//
// This does 2 things:
// 1) Grabs all of the supporting documents associated with
//    tracked items and embeds them within their respective
//    tracked items in a new `documents` key that has been
//    added to each tracked item
// 2) Gets a new array of supporting documents that only
//    includes the documents that are not associated with
//    any tracked items. These items should already be
//    embedded in their respective tracked items anyways,
//    so they are no longer needed
const isEVSSClaim = claim => claim.type === 'evss_claims';

const isAssociatedWithAnyTrackedItem = doc => doc.trackedItemId !== null;

const isAssociatedWithTrackedItem = itemId => doc =>
  doc.trackedItemId === itemId;

const getDocsAssociatedWithTrackedItems = docs =>
  docs.filter(isAssociatedWithAnyTrackedItem);

const getDocsAssociatedWithTrackedItem = (item, docs) => {
  const predicate = isAssociatedWithTrackedItem(item.trackedItemId);
  return docs.filter(predicate);
};

const associateDocsWithTrackedItems = (items, docs) => {
  return items.map(item => {
    const newItem = { ...item };
    const associatedDocs = getDocsAssociatedWithTrackedItem(newItem, docs);
    newItem.documents = associatedDocs || [];
    return newItem;
  });
};

const filterAssociatedDocs = docs =>
  docs.filter(doc => !isAssociatedWithAnyTrackedItem(doc));

const serializeClaim = claim => {
  if (isEVSSClaim(claim)) return claim;

  const { supportingDocuments, trackedItems } = claim.attributes;

  const associatedDocuments = getDocsAssociatedWithTrackedItems(
    supportingDocuments,
  );

  const associatedTrackedItems = associateDocsWithTrackedItems(
    trackedItems,
    associatedDocuments,
  );

  return {
    ...claim,
    attributes: {
      ...claim.attributes,
      supportingDocuments: filterAssociatedDocs(supportingDocuments),
      trackedItems: associatedTrackedItems,
    },
  };
};

const initialState = {
  detail: null,
  loading: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL: {
      return {
        ...state,
        detail: serializeClaim(action.claim),
        loading: false,
      };
    }
    case GET_CLAIM_DETAIL: {
      return set('loading', true, state);
    }
    case SET_CLAIMS_UNAVAILABLE: {
      return {
        ...state,
        detail: null,
        loading: false,
      };
    }
    default:
      return state;
  }
}
