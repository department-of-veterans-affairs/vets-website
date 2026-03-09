export const trackingConfig = {
  dhl: {
    label: 'DHL',
    url: 'http://webtrack.dhlglobalmail.com/?id=462&trackingnumber=',
  },
  fedex: {
    label: 'FedEx',
    url: 'https://www.fedex.com/fedextrack/?trknbr=',
  },
  ups: {
    label: 'UPS',
    url:
      'http://wwwapps.ups.com/WebTracking/processInputRequest?HTMLVersion=5.0&loc=en_US&Requester=UPSHome&tracknum=',
  },
  usps: {
    label: 'USPS',
    url: 'https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=',
  },
};
