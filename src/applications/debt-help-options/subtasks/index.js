import { introOptions } from './introOptions';
import { overpayments } from './flows/overpayments';
import { rogersSTEM } from './flows/rogersStem';
import { attorney } from './flows/attorney';
import { copays } from './flows/copays';
import { seperationPay } from './flows/seperationPay';
import { vettec } from './flows/vettec';

export const SUBTASK_FLOW = {
  intro: introOptions,
  flows: {
    overpayments,
    rogersSTEM,
    attorney,
    copays,
    seperationPay,
    vettec,
  },
};
