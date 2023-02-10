import R from "../../utils/R";
import getInfo from "./get_info";
import login from "./login";
import register from "./register";

class UserService {
  public register(
    name: string,
    password: string,
    confirmedPassword: string,
  ) {
    return register(name, password, confirmedPassword);
  }

  public login(
    name: string,
    password: string,
  ) {
    return login(name, password);
  }

  public getInfo(
    id: string
  ) {
    return getInfo(id);
  }

  public avatar(params: {
    id: string;
    blob: Blob,
  }) {
    return R.ok({});
  }
}

export default UserService;