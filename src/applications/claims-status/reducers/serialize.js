import { scrubDescription } from '../utils/helpers';
import * as TrackedItem from '../utils/trackedItemContent';

// NOTE: In the long term it will make sense to move some of this logic into
//       the backend, but doing it here for now makes it easier to modify in
//       the short-term.
//
// This does a few things:
// 1) Grabs all of the supporting documents associated with tracked items and
//    embeds them within their respective tracked items in a new `documents`
//    key that has been added to each tracked item
// 2) Gets a new array of supporting documents that only includes the documents
//    that are not associated with any tracked items. These items should
//    already be embedded in their respective tracked items anyways, so they
//    are no longer needed
// 3) Performs any additional necessary transforms on supporting document and
//    tracked item data, such as replacing display names and adding date
//    attributes
const isLighthouseClaim = claim => claim.type === 'claim';

const isAssociatedWithAnyTrackedItem = doc => doc.trackedItemId !== null;

const isAssociatedWithTrackedItem = item => doc =>
  doc.trackedItemId === item.id;

const getDocsAssociatedWithTrackedItems = docs =>
  docs.filter(isAssociatedWithAnyTrackedItem);

const getDocsAssociatedWithTrackedItem = (item, docs) => {
  return docs.filter(isAssociatedWithTrackedItem(item));
};

const associateDocsWithTrackedItems = (items, docs) => {
  return items.map(item => ({
    ...item,
    documents: getDocsAssociatedWithTrackedItem(item, docs),
  }));
};

const filterAssociatedDocs = docs =>
  docs.filter(doc => !isAssociatedWithAnyTrackedItem(doc));

const transformUnassociatedDocs = docs =>
  docs.map(doc => ({
    ...doc,
    date: doc.uploadDate,
  }));

const transformAssociatedTrackedItems = items =>
  items.map(item => ({
    ...item,
    description: scrubDescription(item.description),
    date: TrackedItem.getTrackedItemDate(item),
  }));

export const serializeClaim = claim => {
  if (!claim || !isLighthouseClaim(claim)) return claim;

  const { supportingDocuments = [], trackedItems = [] } = claim.attributes;

  const associatedDocuments = getDocsAssociatedWithTrackedItems(
    supportingDocuments,
  );

  const associatedTrackedItems = associateDocsWithTrackedItems(
    trackedItems,
    associatedDocuments,
  );

  const transformedUnassociatedDocuments = transformUnassociatedDocs(
    filterAssociatedDocs(supportingDocuments),
  );

  const transformedAssociatedTrackedItems = transformAssociatedTrackedItems(
    associatedTrackedItems,
  );

  return {
    ...claim,
    attributes: {
      ...claim.attributes,
      supportingDocuments: transformedUnassociatedDocuments,
      trackedItems: transformedAssociatedTrackedItems,
    },
  };
};
