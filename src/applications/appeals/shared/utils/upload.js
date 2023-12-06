export const createPayload = (file, _formId, password) => {
  const payload = new FormData();
  payload.append('decision_review_evidence_attachment[file_data]', file);
  if (password) {
    payload.append('decision_review_evidence_attachment[password]', password);
  }
  return payload;
};
