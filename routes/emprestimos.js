const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'GET',
  });
});

router.post('/', (req, res, next) => {
  const pedido = {
    id_
  }
  res.status(201).send({
    mensagem: 'POST',
  });
});


router.delete('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'DELETE',
  });
});

module.exports = router;
