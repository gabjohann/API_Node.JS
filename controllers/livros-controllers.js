const mysql = require('../mysql').pool;

exports.getLivros = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: erro })}
    conn.query('SELECT * FROM livros;', 
              (error, result, fields) => {
      if (error) {return res.status(500).send({ error: error })}
      const response = {
        'quantidade de livros cadastrados': result.length,
        livros: result.map((livro) => {
          return {
            id_livro: livro.id_livro,
            titulo: livro.titulo,
            ano: livro.ano,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os registros do livro cadastrado.',
              url: 'http://localhost:3000/livros/' + livro.id_livro,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
};

exports.postLivros = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query( 'INSERT INTO livros (titulo, ano) VALUES (?,?)',
      [req.body.titulo, req.body.ano],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        const response = {
          mesagem: 'Livro inserido.',
          livroCriado: {
            id_livro: result.id_livro,
            titulo: req.body.titulo,
            ano: req.body.ano,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os livros.',
              url: 'http://localhost:3000/livros',
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
};

exports.getUmLivro =  (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query( 'SELECT * FROM livros WHERE id_livro = ?;',
      [req.params.id_livro],
      (error, result, field) => {
        if (error) {return res.status(500).send({ error: error })}

        if (result.length == 0) {return res.status(404).send({
            mensagem: 'Não há registro de livros com este ID.',
          });
        }
        const response = {
          livro: {
            id_livro: result[0].id_livro,
            titulo: result[0].titulo,
            ano: result[0].ano,
            request: {
              tipo: 'GET',
              descricao: 'Retorna um livro.',
              url: 'http://localhost:3000/livros',
            },
          },
        };
        return res.status(200).send({ response: result });
      }
    );
  });
};

exports.patchLivro = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'UPDATE livros SET titulo = ?, ano = ? WHERE id_livro = ?;',
      [req.body.titulo, req.body.ano, req.body.id_livro],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mesagem: 'Livro alterado.',
          livroAlterado: {
            id_livro: req.body.id_livro,
            titulo: req.body.titulo,
            ano: req.body.ano,
            request: {
              tipo: 'GET',
              descricao: 'Retornas os detalhes do livro.',
              url: 'http://localhost:3000/livros/' + req.body.id_livro,
            },
          },
        };
        return res.status(202).send({ mensagem: 'Livro alterado.' });
      }
    );
  });
};

exports.deleteLivro = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query('DELETE FROM livros WHERE id_livro = ?;',
      [req.body.id_livro],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Livro deletado.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um livro',
            url: 'http://localhost:3000/livros',
            body: {
              titulo: 'String',
              ano: 'Number'
            }
          }
        }
        return res.status(202).send(response);
      }
    );
  });
};

