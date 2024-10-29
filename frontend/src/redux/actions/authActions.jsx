export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const LoginSucces = (token, email, role) => ({
    type : LOGIN_SUCCESS,
    payload : {token, email, role}
})

export const Logout = () => ({
    type : LOGOUT,
})
