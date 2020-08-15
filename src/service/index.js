import login from './login';
import reg from './reg';
import find from './find';
import playlist from './playlist';
import users from './users';
import comment from './comment';

export default {
  ...login,
  ...reg,
  ...find,
  ...playlist,
  ...users,
  ...comment
};
