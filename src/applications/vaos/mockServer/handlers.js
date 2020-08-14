import { rest } from 'msw';

import confirmedVA from '../api/confirmed_va.json';
import confirmedCC from '../api/confirmed_cc.json';
import requests from '../api/requests.json';
import messages0190 from '../api/messages_0190.json';
import messages0038 from '../api/messages_0038.json';

export const handlers = [
  rest.get(/vaos\/v0\/appointments$/, (req, res, ctx) => {
    if (req.url.searchParams.type === 'cc') {
      return res(ctx.json(confirmedCC));
    }

    return res(ctx.json(confirmedVA));
  }),
  rest.get(/vaos\/v0\/appointment_requests$/, (req, res, ctx) => {
    return res(ctx.json(requests));
  }),
  rest.get(/vaos\/v0\/appointment_requests\/.*\/messages/, (req, res, ctx) => {
    if (req.url.includes('8a48912a6c2409b9016c525a4d490190')) {
      return res(ctx.json(messages0190));
    }

    if (req.url.includes('8a48912a6cab0202016cb4fcaa8b0038')) {
      return res(ctx.json(messages0038));
    }

    return res(ctx.json({ data: [] }));
  }),
];
