import crypto from 'crypto';
import {
  PASSWORD_SECRETKEY,
  JWT_SECRETKEY,
  TIMEOUT_JWT,
} from '../../config.json';
import shortid from 'shortid';
import User from '../../model/user/db';
import R from '../../utils/R';
import jwt from 'jsonwebtoken';

async function register(
  name: string,
  password: string,
  confirmedPassword: string
) {
  try {
    if (password !== confirmedPassword) throw Error('密码不一致');
    if (name.length < 8) throw Error('名字长度小于8');
    if (name.length > 24) throw Error('名字长度大于24');
    if (password.length < 8) throw Error('密码长度小于8');
    if (password.length > 24) throw Error('密码长度大于24');

    let user = await User.findOne({
      where: { name },
    });

    if (user) throw Error('此用户名已存在');

    const passwordParsed = crypto
      .createHmac('md5', PASSWORD_SECRETKEY)
      .update(password)
      .digest('hex');

    const id = shortid.generate().replace('_', 'A').replace('-', 'a');
    const userNew = User.build({
      id,
      name,
      password: passwordParsed,
    });

    await userNew.save();

    const token = jwt.sign({ id }, JWT_SECRETKEY, { expiresIn: TIMEOUT_JWT });

    return R.ok({ token });
  } catch (error) {
    return R.fail(R.SERVICE_ERR, error as Error);
  }
}

export default register;
