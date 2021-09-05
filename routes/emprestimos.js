const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const EmprestimosController = require('../controllers/emprestimos-controllers');

router.get('/', EmprestimosController.getEmprestimos);
router.post('/', login, EmprestimosController.postEmprestimos);
router.get('/:id_emprestimo', EmprestimosController.getUmEmprestimo);
router.delete('/', login, EmprestimosController.deleteEmprestimo);

module.exports = router;
