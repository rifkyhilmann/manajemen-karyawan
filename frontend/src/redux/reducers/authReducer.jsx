import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('email', action.payload.email);
            return {
                ...state,
                token: action.payload.token,
                email: action.payload.email,
                role : action.payload.role,
            };
        case LOGOUT:
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            return initialState;
        default:
            return state;
    }
};

export default authReducer;
