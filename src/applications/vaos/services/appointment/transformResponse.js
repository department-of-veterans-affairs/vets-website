import { createEntityAdapter } from '@reduxjs/toolkit';
import normalize from 'json-api-normalizer';

export const adapter = createEntityAdapter({});
const initialState = adapter.getInitialState();
console.log('initial state', initialState);
export default function transformResponse(response, _meta, _arg) {
  console.log('response', response);
  const normalizedData = normalize(response);
  // const normalizedData = normalize({
  //   data: [
  //     {
  //       id: response.id,
  //       type: 'appointment',
  //       attributes: { ...response },
  //     },
  //   ],
  // });
  console.log('normalized response', normalizedData);
  adapter.upsertMany(adapter.getInitialState(), normalizedData.appointments);
  return normalizedData;
}
