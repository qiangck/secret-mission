const SESSION_NAME = 'session_token';

export const setSession = (sessionid: string) => {
  if (!sessionid) {
    throw new Error('session为空');
  }

  window.localStorage.setItem(SESSION_NAME, sessionid);
};

export const getSession = () => window.localStorage.getItem(SESSION_NAME);
