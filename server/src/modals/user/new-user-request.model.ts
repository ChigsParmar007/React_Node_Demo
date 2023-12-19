/**
 * a class to transfer new user request details
 */
export class NewUserRequest {
  public firstName: string = '';
  public lastName: string = '';
  public userName: string = '';
  public gender: string = '';
  public dob: Date = new Date();
  public age: Number = 0;
  public mobileNumber: Number = 0;
  public email: string = '';
  public password: string = '';
  public passwordConfirm: string = '';

  public static parseJson(jsonObject: any): NewUserRequest {
    const newUserRequest: NewUserRequest = new NewUserRequest();

    if (!jsonObject) {
      return newUserRequest;
    }

    newUserRequest.firstName = jsonObject.firstName;
    newUserRequest.lastName = jsonObject.lastName;
    newUserRequest.userName = jsonObject.userName;
    newUserRequest.gender = jsonObject.gender;
    newUserRequest.dob = jsonObject.dob;
    newUserRequest.mobileNumber = jsonObject.mobileNumber;
    newUserRequest.email = jsonObject.email ? jsonObject.email.toLowerCase() : jsonObject.email;
    newUserRequest.password = jsonObject.password;
    newUserRequest.passwordConfirm = jsonObject.passwordConfirm;

    let currentDate = new Date();
    let birthDate = new Date(jsonObject.dob);

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    let hasBirthdayPassed =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    newUserRequest.age = age;

    return newUserRequest;
  }
}
