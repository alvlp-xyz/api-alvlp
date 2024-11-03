import { Router } from 'express';
import api from './api.js';
const routes = Router();
routes.get('/', (_, res) => res.status(200).json({ status: 'Ok', otakudesu: '/otakudesu', samehadaku: '/samehadaku' }));
routes.use('/api/otakudesu', api);
export default routes;
