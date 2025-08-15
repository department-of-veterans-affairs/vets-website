export const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.append('attachment[file_data]', file);
  payload.append('form_id', formId);
  payload.append('name', file.name);

  // password for encrypted PDFs
  if (password) {
    payload.append('attachment[password]', password);
  }

  return payload;
};

export const parseResponse = ({ data }, file) => ({
  guid: data.attributes.guid,
  confirmationCode: data.id,
  name: file.name,
});
