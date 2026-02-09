import PropTypes from 'prop-types';

export const debtPropTypes = PropTypes.shape({
  compositeDebtId: PropTypes.string.isRequired,
  currentAr: PropTypes.number,
  debtHistory: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
    }),
  ),
  deductionCode: PropTypes.string,
  benefitType: PropTypes.string,
  diaryCode: PropTypes.string,
});

export const copayPropTypes = PropTypes.shape({
  // Will add in copay prop types once main copay updates are pushed
});

export const cardIconPropTypes = {
  type: PropTypes.string.isRequired,
};

export const linkItemPropTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
  }).isRequired,
};

export const cardLinksPropTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
  transformed: PropTypes.shape({
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
  }).isRequired,
  view: PropTypes.string.isRequired,
};

export const phoneNumbersPropTypes = {
  phoneSet: PropTypes.object,
};

export const routerVaLinkPropTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  view: PropTypes.string,
  type: PropTypes.string,
};

export const commonPropTypes = {
  debt: debtPropTypes,
  copay: copayPropTypes,
  type: PropTypes.oneOf(['debt', 'copay']).isRequired,
  data: PropTypes.oneOfType([debtPropTypes, copayPropTypes]).isRequired,
};
