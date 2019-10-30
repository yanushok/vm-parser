import { Router } from 'express';
import { parseVmCode } from "../controllers/parser.controller";

const router = Router();

router.get('/task', (req, res) => { res.status(200).send('/task'); });
router.route('/task/:id')
    .get((req, res) => { res.status(200).send(`/task/${req.params.id}`); })
    .post((req, res) => {})
    .delete((req, res) => {});
    
router.post('/continue/:id', (req, res) => {});
router.get('/status/:id', (req, res) => {});

router.post('/parse', parseVmCode);

export default router;