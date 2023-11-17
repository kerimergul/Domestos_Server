import { Router } from 'express';
import { upload, get } from '../controllers/client-api/index.js';

const router = Router();


router.post('/upload', upload);
// router.post('/getImage', get);


export default router