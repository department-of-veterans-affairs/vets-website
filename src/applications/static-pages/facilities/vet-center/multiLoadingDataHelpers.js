import PropTypes from 'prop-types';

export const multidataPropTypes = PropTypes.objectOf(
  PropTypes.shape({ data: PropTypes.array }),
);
export const multiLoadingPropTypes = PropTypes.objectOf(PropTypes.bool);

export const isStartedLoading = multiLoading => {
  return multiLoading.Health || multiLoading.VetCenter || multiLoading.Cemetery;
};

export const hasAnyMultiData = ({ multidata }) => {
  return (
    !!multidata?.Health?.data ||
    !!multidata?.VetCenter?.data ||
    !!multidata?.Cemetery?.data
  );
};
hasAnyMultiData.propTypes = {
  multidata: multidataPropTypes.isRequired,
};

export const isFinishedLoading = ({ multiLoading, multidata }) => {
  return (
    !multiLoading.Health &&
    !multiLoading.VetCenter &&
    !multiLoading.Cemetery &&
    !!multidata?.Health?.data &&
    !!multidata?.VetCenter?.data &&
    !!multidata?.Cemetery?.data
  );
};

isFinishedLoading.propTypes = {
  multiLoading: multiLoadingPropTypes.isRequired,
  multidata: multidataPropTypes.isRequired,
};

export const joinMultiData = props => {
  const { multidata } = props;
  if (!multidata) {
    return [];
  }
  return Object.values(multidata).reduce((acc, value) => {
    return [...acc, ...(value.data || [])];
  }, []);
};

joinMultiData.propTypes = {
  multidata: multidataPropTypes.isRequired,
};
