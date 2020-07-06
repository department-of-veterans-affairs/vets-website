const transform = fieldData => {
  const { platform, value } = fieldData[0];
  return {
    platform,
    value,
    platformValues: JSON.stringify(fieldData[0].platform_values),
  };
};

const applicableTypes = ['Social Media Links Field '];
const predicate = fieldSchema =>
  applicableTypes.includes(fieldSchema['Field type']);

module.exports = { predicate, transform };
