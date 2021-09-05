const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const LivrosController = require('../controllers/livros-controllers');
router.get('/', LivrosController.getLivros);


router.post('/', login, LivrosController.postLivros);


router.get('/:id_livro', LivrosController.getUmLivro);


router.patch('/', login, LivrosController.patchLivro);


router.delete('/', login, LivrosController.deleteLivro);

module.exports = router;
