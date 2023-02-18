import crypto from 'crypto';
import {
  PASSWORD_SECRETKEY,
  JWT_SECRETKEY,
  TIMEOUT_JWT,
} from '../../config.json';
import jwt from 'jsonwebtoken';
import User from '../../model/user/db';
import R from '../../utils/R';

async function login(name: string, password: string) {
  try {
    password = crypto
      .createHmac('md5', PASSWORD_SECRETKEY)
      .update(password)
      .digest('hex');

    const user = await User.findOne({
      where: {
        name,
        password,
      },
    });

    if (!user) throw new Error('用户名或密码错误');

    const token = jwt.sign({ id: user.getDataValue('id') }, JWT_SECRETKEY, {
      expiresIn: TIMEOUT_JWT,
    });

    return R.ok({ token });
  } catch (error) {
    return R.fail(R.SERVICE_ERR, error as Error);
  }
}

export default login;
