export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      applicantName: {
        first: formData.applicantName.first,
        middle: formData.applicantName.middle,
        last: formData.applicantName.last,
      },
      ssn: formData.ssn,
      vaFileNumber: formData.vaFileNumber,
    },
    pages,
  };
}
