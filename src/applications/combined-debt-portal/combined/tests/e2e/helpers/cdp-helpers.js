export const reply404 = req => {
  return req.reply(404, { errors: ['error'] });
};
