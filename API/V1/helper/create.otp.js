module.exports.ramdomOtp = (number) => {
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < number; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};