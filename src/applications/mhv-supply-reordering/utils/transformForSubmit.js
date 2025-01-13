const transformForSubmit = ({
  chosenSupplies,
  emailAddress,
  permanentAddress,
}) => {
  const productIds = Object.keys(chosenSupplies)
    .filter(key => !!chosenSupplies[key]); // prettier-ignore
  const order = productIds.map(id => ({ productId: id }));

  return {
    order,
    vetEmail: emailAddress,
    permanentAddress,
    useVeteranAddress: true,
    useTemporaryAddress: false,
  };
};

// const transformForSubmit = args => {
//   console.log({ args });
//   return args;
// };

export default transformForSubmit;
