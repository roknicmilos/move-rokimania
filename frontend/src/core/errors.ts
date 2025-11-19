import { ApiBadRequestResponse } from "@/api/type";

export type ValidationErrorFields = Record<string, string | null>;


export class RegisterApiValidationError extends Error {
  public fields: ValidationErrorFields;

  constructor(responseData: ApiBadRequestResponse) {
    super("Registration API validation error")
    this.fields = {
      username: responseData.errors.username ? responseData.errors.username[0] : null,
      password: responseData.errors.password ? responseData.errors.password[0] : null,
    }
    this.name = "RegisterApiValidationError";
  }

}

export class LoginApiValidationError extends Error {
  public fields: ValidationErrorFields;

  constructor(responseData: ApiBadRequestResponse) {
    super("Login API validation error")
    this.fields = {
      __all__: responseData.errors.__all__
        ? responseData.errors.__all__[0]
        : "Username and/or password is incorrect.",
    }
    this.name = "LoginApiValidationError";
  }

}
