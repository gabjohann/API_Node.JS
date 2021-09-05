const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarAssociado = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'SELECT * FROM associados WHERE CPF = ?',
      [req.body.CPF],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (results.length > 0) {
          res.status(409).send({ mensagem: 'Associado já cadastrado.' });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              `INSERT INTO associados (RG, CPF, nome, sobrenome, senha, contato) VALUES (?,?,?,?,?,?)`,
              [
                req.body.RG,
                req.body.CPF,
                req.body.nome,
                req.body.sobrenome,
                hash,
                req.body.contato,
              ],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                response = {
                  mensagem: 'Associado cadastrado.',
                  associadoCadastrado: {
                    id_associado: results.insertId,
                    RG: req.body.RG,
                    CPF: req.body.CPF,
                    Nome: req.body.nome,
                    Sobrenome: req.body.sobrenome,
                    Contato: req.body.contato,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
};

exports.loginAssociado = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const query = `SELECT * FROM associados WHERE CPF = ?`;
    conn.query(query, [req.body.CPF], (error, results, fields) => {
      conn.release();
      if (error) {  return res.status(500).send({ error: error })  }
      if (results.length < 1) { return res.status(401).send({ mensagem: 'A autenticação falhou.' }) }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {  return res.status(401).send({ mensagem: 'A autenticação falhou.' })  }
        if (result) { 
          const token = jwt.sign({
              id_associado: results[0].id_associado,
              CPF: results[0].CPF,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            });

          return res.status(200).send({ 
            mensagem: 'Autenticado!', 
            token: token 
          });
        }
        return res.status(401).send({ mensagem: 'A autenticação falhou' });
      });
    });
  });
};