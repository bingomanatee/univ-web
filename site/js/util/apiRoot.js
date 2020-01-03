const NODE_ENV = process.env.NODE_ENV || 'development';
const PROD_API_ROOT = 'https://univ-2019.appspot.com';
const LOCAL_ROOT = 'http://localhost:8081';

export default () => {
  if (NODE_ENV === 'production') {
    return PROD_API_ROOT;
  }
  return LOCAL_ROOT;
};
