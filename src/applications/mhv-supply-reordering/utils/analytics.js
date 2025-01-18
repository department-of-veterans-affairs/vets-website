import { recordEventOnce as recordEventOnceFn } from '~/platform/monitoring/record-event';
import transformDlcResponse from './transformSubmitResponse';

const analytics = ({
  ok,
  resource = [],
  productIdsCount,
  trackingPrefix,
  recordEventOnce = recordEventOnceFn,
}) => {
  const { processedProductIds, pendingProductIds } =
    transformDlcResponse(resource); // prettier-ignore

  const result =
    ok && processedProductIds.length !== 0 ? 'successful' : 'failure';
  const event = `${trackingPrefix}-submission-${result}`;

  const args = {
    event,
    'product-ids-count': productIdsCount,
  };

  if (processedProductIds.length > 0 && pendingProductIds.length > 0) {
    args['partial-failed'] = true;
    args['product-ids-successful'] = processedProductIds;
    args['product-ids-failed'] = pendingProductIds;
  } else if (ok && processedProductIds.length === 0) {
    args['product-ids-failed'] = pendingProductIds;
  }

  recordEventOnce(args);
};

export default analytics;
