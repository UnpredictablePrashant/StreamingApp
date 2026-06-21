const getEnv = (key, fallback) => {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
};

export const AUTH_API_URL = getEnv('REACT_APP_AUTH_API_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com/api/auth');
export const STREAMING_API_URL = getEnv('REACT_APP_STREAMING_API_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com/api/streaming');
export const STREAMING_PUBLIC_URL = getEnv('REACT_APP_STREAMING_PUBLIC_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com');
export const ADMIN_API_URL = getEnv('REACT_APP_ADMIN_API_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com/api/admin');
export const CHAT_API_URL = getEnv('REACT_APP_CHAT_API_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com/api/chat');
export const CHAT_SOCKET_URL = getEnv('REACT_APP_CHAT_SOCKET_URL', 'http://a2a67053da4f04a9eb9dac77ad7e09fd-2063731993.us-east-1.elb.amazonaws.com');
