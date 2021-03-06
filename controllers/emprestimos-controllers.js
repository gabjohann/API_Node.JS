const mysql = require('../mysql').pool;

exports.getEmprestimos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT emprestimos.id_emprestimo, 
                                        emprestimos.id_associado,
                                        associados.nome, 
                                        associados.sobrenome, 
                                        emprestimos.id_livro,
                                        livros.titulo, emprestimos.id_editora, 
                                        editoras.nome_editora,
                                        emprestimos.prazo_devolucao, 
                                        emprestimos.data_emprestimo,
                                        emprestimos.data_devolucao
                           FROM emprestimos, 
                                        associados, 
                                        livros, 
                                        editoras
                         WHERE emprestimos.id_livro = livros.id_livro AND
                                        emprestimos.id_editora = editoras.id_editora AND
                                        emprestimos.id_associado = associados.id_associado;`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ errror: error });
        }
        const response = {
          emprestimos: result.map(emprestimos => {
            return {
              id_emprestimo: emprestimos.id_emprestimo,
              'quantidade de emprestimos': result.length,
              detalhes: {
                id_associado: emprestimos.id_associado,
                'nome': emprestimos.nome,
                'sobrenome': emprestimos.sobrenome,
                id_livro: emprestimos.id_livro,
                titulo: emprestimos.titulo,
                id_editora: emprestimos.id_editora,
                'nome editora': emprestimos.nome_editora,
                'data emprestimo': emprestimos.data_emprestimo,
                'prazo devolucao': emprestimos.prazo_devolucao,
                'data devolucao': emprestimos.data_devolucao
              },
              request: {
                tipo: 'GET',
                descricao: 'Retorrna os detalhes do empr??stimo',
                url:
                  'http://localhost:3000/emprestimos/' +
                  emprestimos.id_emprestimo,
              },
            };
          }),
        }
        return res.status(200).send(response);
      }
    );
  });
};

exports.postEmprestimos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
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
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: 'Empr??stimo inserido.',
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
  });
};

exports.getUmEmprestimo = (req, res, next) => {
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
            mensagem: 'N??o h?? empr??stimos cadastrados com este ID',
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
              descricao: 'Retorna todos os empr??stimos',
              url: 'http://localhost:3000/emprestimos',
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
};

exports.deleteEmprestimo = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'DELETE FROM emprestimos WHERE id_emprestimo = ?;',
      [req.body.id_emprestimo],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: 'Empr??stimo deletado.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um emp??estimo.',
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
};
