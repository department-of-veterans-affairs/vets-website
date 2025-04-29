export const createPayload = file => {
  const payload = new FormData();
  payload.append('form1010_ezr_attachment[file_data]', file);
  return payload;
};

export const parseResponse = (response, file) => ({
  name: file.name,
  confirmationCode: response.data.attributes.guid,
  size: file.size,
});
