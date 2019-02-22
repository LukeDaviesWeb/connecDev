const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function valiateRegisterInput(data) {
  let errors = {};

  //Validator's isEmpty() only accepts strings, this makes sure the variables = an empty string if they dont exist

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  //email

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  //password

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isvalid: isEmpty(errors)
  };
};
