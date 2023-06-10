export interface SignUpRequest {
    username: string,
    password: string,
    email: string,
    fullname: string,
}

export interface SignInRequest {
    username: string,
    password: string,
}

export interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string,
}