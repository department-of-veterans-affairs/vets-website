export const reply404 = req => {
  return req.reply(404, { errors: ['error'] });
};

export const reply403 = req => {
  return req.reply(403, { errors: ['error'] });
};
