/* eslint-disable no-unreachable */
export default function prefillTransformer(pages, formData, metadata, state) {
  let newData = formData;

  if (state) {
    newData = { ...newData };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}
