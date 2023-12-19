import { isEmpty } from 'lodash';
import { NewUserRequest } from '../../modals/user/new-user-request.model';
import { userName_regex, email_regex, only_alphabets_regex, only_numbers } from './regex/regex.util';
import { gender } from '../../constants/key.constants';

export class ValidationUtil {
  public static validateUserCreateRequest(newUserRequest: NewUserRequest): string {
    // first name validation
    if (isEmpty(newUserRequest.firstName) || !newUserRequest.firstName.trim()) {
      return "First name can't be blank";
    }
    if (!only_alphabets_regex.test(newUserRequest.firstName)) {
      return 'First name can only contain alphabets';
    }

    // last name validation
    if (isEmpty(newUserRequest.lastName) || !newUserRequest.lastName.trim()) {
      return "Last name can't be blank";
    }
    if (!only_alphabets_regex.test(newUserRequest.lastName)) {
      return 'Last name can only contain alphabets, numbers and special characters(-.)';
    }

    // userName validation
    if (isEmpty(newUserRequest.userName) || !newUserRequest.userName.trim()) {
      return "UserName can't be blank";
    }
    if (!userName_regex.test(newUserRequest.userName)) {
      return 'UserName can only contain alphabets, numbers and special characters(-.)';
    }

    // gender validation
    if (isEmpty(newUserRequest.gender) || !newUserRequest.gender.trim()) {
      return "Gender can't be blank";
    }
    if (!gender.includes(newUserRequest.gender)) {
      return 'please select valid gender';
    }

    // email validation
    if (isEmpty(newUserRequest.email) || !newUserRequest.email.trim()) {
      return "email can't be blank";
    }
    if (!email_regex.test(newUserRequest.email)) {
      return 'Invalid email address';
    }

    // mobile number validation
    if (isEmpty(newUserRequest.mobileNumber.toString()) || !newUserRequest.mobileNumber.toString().trim()) {
      return "Mobile number can't be blank";
    }
    if (newUserRequest.mobileNumber.toString().trim().length !== 10) {
      return 'Mobile number must be at least 10 characters';
    }
    if (!only_numbers.test(newUserRequest.mobileNumber.toString())) {
      return 'Mobile number must be digits';
    }

    // password validation
    if (isEmpty(newUserRequest.password) || !newUserRequest.password.trim()) {
      return "password can't be blank";
    }
    if (!/(?=.*[a-z])/.test(newUserRequest.password)) {
      return 'Password must contain a lower case letter';
    }
    if (!/(?=.*[A-Z])/.test(newUserRequest.password)) {
      return 'Password must contain an upper case letter';
    }
    if (!/(?=.*[0-9])/.test(newUserRequest.password)) {
      return 'Password must contain a number';
    }
    if (!/(?=.[!@#%&$*|_\^])/.test(newUserRequest.password)) {
      return 'Password must contain a special character';
    }

    // password and confirm password match validation
    if (isEmpty(newUserRequest.passwordConfirm) || !newUserRequest.passwordConfirm.trim()) {
      return "password confirm can't be blank";
    }
    if (newUserRequest.password !== newUserRequest.passwordConfirm) {
      return 'Password and Password confirm are not match';
    }

    return '';
  }
}
