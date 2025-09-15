export function addConditionalDependency(pages, dependency) {
  return Object.entries(pages).reduce((acc, [key, page]) => {
    acc[key] = {
      ...page,
      depends: dependency,
    };
    return acc;
  }, {});
}
