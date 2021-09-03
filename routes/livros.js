const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//  RETORNA TODOS OS LIVROS
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }
    conn.query('SELECT * FROM livros;', (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ response: resultado });
    });
  });
});

// INSERE UM LIVRO
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'INSERT INTO livros (titulo, ano) VALUES (?,?)',
      [req.body.titulo, req.body.ano],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(201).send({
          mensagem: 'Livro inserido.',
          id_livro: resultado.insertId,
        });
      }
    );
  });
});

// RETORNA OS DADOS DE UM LIVRO
router.get('/:id_livro', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'SELECT * FROM livros WHERE id_livro = ?;',
      [req.params.id_livro],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ response: resultado });
      }
    );
  });
});

// ALTERA UM LIVRO
router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'UPDATE livros SET titulo = ?, ano = ? WHERE id_livro = ?;',
      [req.body.titulo, req.body.ano, req.body.id_livro],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(202).send({ mensagem: 'Livro alterado.' });
      }
    );
  });
});

// EXCLUI UM LIVRO
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'DELETE FROM livros WHERE id_livro = ?;',
      [req.body.id_livro],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(202).send({
          mensagem: 'Livro deletado.',
        });
      }
    );
  });
});

module.exports = router;
