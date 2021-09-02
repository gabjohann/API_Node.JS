const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'Retorna todos os livros.',
  });
});

router.post('/', (req, res, next) => {
  const livro = {
    titulo: req.body.titulo,
    ano: req.body.ano
  };

  res.status(201).send({
    mensagem: 'Livro inserido.',
    livroCriado: livro
  });
});

router.patch('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'Estado do livro alterado.',
  });
});

router.delete('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'Livro deletado.',
  });
});

module.exports = router;
