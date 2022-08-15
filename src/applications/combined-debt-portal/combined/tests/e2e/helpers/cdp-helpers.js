export const reply404 = req => {
  return req.reply(404, { errors: ['error'] });
};

export const reply403 = req => {
  return req.reply(403, {
    errors: [
      {
        title: 'Forbidden',
        detail: 'User does not have access to the requested resource',
        code: '403',
        status: '403',
      },
    ],
  });
};
