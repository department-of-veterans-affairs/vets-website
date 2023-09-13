import { getTrackedItemDate } from '../utils/helpers';

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
const isLighthouseClaim = claim => claim.type === 'claim';

const isAssociatedWithAnyTrackedItem = doc => doc.trackedItemId !== null;

const isAssociatedWithTrackedItem = item => doc =>
  doc.trackedItemId === item.id;

const getDocsAssociatedWithTrackedItems = docs =>
  docs.filter(isAssociatedWithAnyTrackedItem);

const getDocsAssociatedWithTrackedItem = (item, docs) => {
  const predicate = isAssociatedWithTrackedItem(item);
  return docs.filter(predicate);
};

const associateDocsWithTrackedItems = (items, docs) => {
  return items.map(item => {
    const newItem = { ...item };
    const associatedDocs = getDocsAssociatedWithTrackedItem(newItem, docs);
    newItem.documents = associatedDocs || [];
    newItem.date = getTrackedItemDate(item);
    return newItem;
  });
};

const filterAssociatedDocs = docs =>
  docs.filter(doc => !isAssociatedWithAnyTrackedItem(doc));

export const serializeClaim = claim => {
  if (!claim || !isLighthouseClaim(claim)) return claim;

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
      supportingDocuments: filterAssociatedDocs(supportingDocuments).map(
        doc => {
          return {
            ...doc,
            date: doc.uploadDate,
          };
        },
      ),
      trackedItems: associatedTrackedItems,
    },
  };
};
