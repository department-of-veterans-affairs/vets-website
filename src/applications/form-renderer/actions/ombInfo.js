export const OMB_INFO_LOADED = 'FORM_RENDERER/OMB_INFO_LOADED';

export const ombInfoLoaded = ombInfo => ({
  type: OMB_INFO_LOADED,
  payload: { ombInfo },
});
