export const createPayload = file => {
  const payload = new FormData();
  payload.append('hca_attachment[file_data]', file);
  return payload;
};

export const parseResponse = (response, file) => ({
  name: file.name,
  confirmationCode: response.data.attributes.guid,
  size: file.size,
});
