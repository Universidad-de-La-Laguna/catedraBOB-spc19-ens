var express = require('express')
var app = express()
const eventListener = require('./event-listener')

const PORT = process.env.PORT || '8000'

app.get('/new', (req, res) => {
    if (eventListener.addContract(req.query.contract)) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            code: 200,
            message: `Succefully watching contract ${req.query.contract}`
        }))
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
            code: 500,
            message: `Error al intentar monitorizar el contrato ${req.query.contract}`
        }))
    }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})