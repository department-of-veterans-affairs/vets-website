export default function nonRequiredFullName(fullName) {
  return {
    ...fullName,
    required: [],
  };
}
