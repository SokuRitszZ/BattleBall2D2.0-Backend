import updateAvatar from './avatar';
import getInfo from './get_info';
import login from './login';
import register from './register';
import formidable from 'formidable';

class UserService {
  public register(name: string, password: string, confirmedPassword: string) {
    return register(name, password, confirmedPassword);
  }

  public login(name: string, password: string) {
    return login(name, password);
  }

  public getInfo(id: string) {
    return getInfo(id);
  }

  public avatar(id: string, file: formidable.File) {
    return updateAvatar(id, file);
  }
}

export default UserService;
