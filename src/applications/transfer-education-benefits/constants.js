import PropTypes from 'prop-types';

export const SPONSOR_RELATIONSHIP = {
  CHILD: 'Child',
  SPOUSE: 'Spouse',
};

export const SPONSORS_TYPE = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    relationship: PropTypes.string,
  }),
);
