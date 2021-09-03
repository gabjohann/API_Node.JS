const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'Retorna todos os livros.',
  });
});

router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      'INSERT INTO livros (titulo, ano) VALUES (?,?)',
      [req.body.titulo, req.body.ano],
      (error, resultado, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: 'Livro inserido.',
          id_livro: resultado.insertId,
        });
      }
    );
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
