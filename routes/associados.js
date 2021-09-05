const express = require('express');
const router = express.Router();

const AssociadosController = require('../controllers/associados-controllers');


router.post('/cadastro', AssociadosController.cadastrarAssociado);
router.post('/login', AssociadosController.loginAssociado);

module.exports = router;