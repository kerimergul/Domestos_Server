import { Router } from 'express';

import image from "./image.js";

const router = Router();

router.use('/image', image);


export default router;