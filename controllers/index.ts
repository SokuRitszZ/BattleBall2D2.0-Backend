import { Express, Router } from 'express';
import userController from './user/index';

function initController(server: Express) {
  const router = Router();

  router.use('/user', userController);

  server.use('/api', router);
}

export default initController;
