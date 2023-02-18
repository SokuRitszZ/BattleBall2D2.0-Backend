import { Router } from 'express';
import formidable from 'formidable';
import hasNull from '../../utils/hasNull';
import R from '../../utils/R';
import trimAll from '../../utils/trimAll';
import UserService from './../../service/user/index';

const userController = Router();
const service = new UserService();

userController.get('/', async (req, res) => {
  res.end('user api.');
});

userController.post('/register', async (req, res) => {
  try {
    const { name, password, confirmedPassword } = req.body;
    if (hasNull([name, password, confirmedPassword]))
      throw TypeError('表单值不能为空');

    let params = trimAll([name, password, confirmedPassword]);
    if (hasNull(params)) throw TypeError('表单值不能为空');

    res.json(await service.register(...(params as [string, string, string])));
  } catch (error) {
    res.json(R.fail(R.PARAM_ERR, error as Error));
  }
});

userController.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (hasNull([name, password])) throw TypeError('表单值不能为空');

    let params = trimAll([name, password]);
    if (hasNull(params)) throw TypeError('表单值不能为空');

    res.json(await service.login(...(params as [string, string])));
  } catch (error) {
    res.json(R.fail(R.PARAM_ERR, error as Error));
  }
});

userController.get('/get_info', async (req, res) => {
  try {
    // @ts-ignore
    const { id } = req.auth;
    res.json(await service.getInfo(id));
  } catch (error) {
    res.json(R.fail(R.PARAM_ERR, error as Error));
  }
});

userController.post('/avatar', async (req, res) => {
  // @ts-ignore
  const { id } = req.auth;
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, field, file) => {
    if (err) return res.json(R.fail(R.PARAM_ERR, Error('上传错误')));
    // @ts-ignore
    return res.json(await service.avatar(id, file['img']));
  });
});

export default userController;
