import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      _id
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      email
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
