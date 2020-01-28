export default function nonRequiredFullName(fullName) {
  return Object.assign({}, fullName, {
    required: [],
  });
}
