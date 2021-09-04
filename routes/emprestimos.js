const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS EMPRÉSTIMOS
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query('SELECT * FROM emprestimos;', (error, result, fields) => {
      if (error) {return res.status(500).send({ error: error })}
      const response = {
        'quantidade de emprestimos': result.length,
        emprestimos: result.map((emprestimo) => {
          return {
            id_emprestimo: emprestimo.id_emprestimo,
            id_associado: emprestimo.id_associado,
            data: emprestimo.data,
            'prazo devolucao': emprestimo.prazo_devolucao,
            'data devolucao': emprestimo.data_devolucao,
            request: {
              tipo: 'GET',
              descricao: 'Retorrna os detalhes do empréstimo',
              url:
                'http://localhost:3000/emprestimos/' + emprestimo.id_emprestimo,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

// INSERE UM EMPRÉSTIMO
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).semd({ error: error })}
    conn.query(
      'SELECT  * FROM emprestimos WHERE id_emprestimo = ?;',
      [req.body.id_emprestimo],
      (error, result, field) => {
        if (error) {return res.status(500).send({ error: error })}
        if (result.length == 0) {
          return res.status(404).send({
            mensagem:
              'Não foi encontrado nenhum registro de empréstimo com este ID.',
          });
        }
        conn.query(
          'INSERT INTO emprestimos (id_associado, data, prazo_devolucao, data_devolucao) VALUES (?,?,?,?) ;',
          [
            req.body.id_associado,
            req.body.data,
            req.body.prazo_devolucao,
            req.body.data_devolucao,
          ],
          (error, result, field) => {
            conn.release();
            if (error) {return res.status(500).send({ error: error })}
            const response = {
              mensagem: 'Empréstimo inserido.',
              emprestimoCriado: {
                id_emprestimo: result.id_emprestimo,
                id_associado: req.body.id_associado,
                data: req.body.data,
                prazo_devolucao: req.body.prazo_devolucao,
                data_devolucao: req.body.data_devolucao,
                request: {
                  tipo: 'GET',
                  descricao: 'Retorna todos os emprestimos',
                  url: 'http://localhost:3000/emprestimos',
                },
              },
            };
            return res.status(201).send(response);
          }
        );
      }
    );
  });
});

// RETORNA OS DADOS DE UM EMPRÉSTIMO
router.get('/:id_emprestimo', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'SELECT * FROM emprestimos WHERE id_emprestimo = ?;',
      [req.params.id_emprestimo],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não há empréstimos cadastrados com este ID',
          });
        }
        const response = {
          emprestimo: {
            id_emprestimo: result[0].id_emprestimo,
            id_associado: result[0].id_associado,
            data: result[0].data,
            prazo_devolucao: result[0].prazo_devolucao,
            data_devolucao: result[0].data_devolucao,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os empréstimos',
              url: 'http://localhost:3000/emprestimos',
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

// DELETA UM EMPRÉSTIMO
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'DELETE FROM emprestimos WHERE id_emprestimo = ?;',
      [req.body.id_emprestimo],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Empréstimo deletado.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um empŕestimo.',
            url: 'http://localhost:3000/emprestimos',
            body: {
              id_associado: 'Number',
              data: 'Number',
              prazo_devolucao: 'Number',
              data_devolucao: 'Number',
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
