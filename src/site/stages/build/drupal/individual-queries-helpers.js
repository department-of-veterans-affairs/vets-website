function generatePaginatedQueries({
  operationNamePrefix,
  entitiesPerSlice,
  totalEntities,
  getSlice,
}) {
  const numberOfSlices = Math.ceil(totalEntities / entitiesPerSlice);

  return new Array(numberOfSlices)
    .fill(null)
    .map((_, index) => {
      const operationName = `${operationNamePrefix}__slice${index + 1}`;
      const offset = entitiesPerSlice * index;
      const isLastPage = index + 1 === numberOfSlices;

      let limit = entitiesPerSlice;
      if (isLastPage) {
        limit = totalEntities - offset;
      }

      return [operationName, getSlice(operationName, offset, limit)];
    })
    .reduce((queriesByOperationName, [operationName, query]) => {
      return {
        ...queriesByOperationName,
        [operationName]: query,
      };
    }, {});
}

module.exports = {
  generatePaginatedQueries,
};
