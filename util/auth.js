import axios from "axios"


const API_KEY = 'key';


const authenticate = async (mode, email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
  );

  const token = response.data.idToken;

  return token;
}


export const createUser = (email, password) => {
  console.log('created new user');
  return authenticate('signUp', email, password);
}

export const login = (email, password) => {
  console.log('logging in');
  return authenticate('signInWithPassword', email, password);
}


export const resetPassword = async (email) => {
  console.log('sending email..');
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

  const response = await axios.post(url,
    {
      email: email,
      requestType: 'PASSWORD_RESET'
    }
  );

  const token = response.data.idToken;
  console.log("Reset password token: ", token);

  return token;
}
