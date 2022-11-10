const { Route } = require('express')
const express = require('express')
const app = express()
const port = 3000
const resolve= require ('./routes/solver.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json())
app.post('/api/filterList', (req,res)=>{
    res.send(resolve.filterList(req.body.language, req.body.total, req.body.start,req.body.computelist, req.body.filter, req.body.LastWord))
})

app.post('/api/ChooseBestWord', (req,res)=>{
    res.send(resolve.ChooseBestWord(req.body.wordlist))
})

app.use('/static',express.static('static'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

