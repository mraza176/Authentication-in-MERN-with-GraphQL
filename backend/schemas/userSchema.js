export const typeDefs = `#graphql
type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    profilePic: String
    gender: String!
}
type Query {
    authUser: User
    user(userId: ID!): User
}
type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
}
input SignUpInput {
    name: String!
    email: String!
    password: String!
    gender: String!
}
input LoginInput {
    email: String!
    password: String!
}
type LogoutResponse {
    message: String!
}
`;
