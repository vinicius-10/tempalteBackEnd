const express = require('express');
const LivroDao = require('./LivroDao')

const app = express();
const PORT = 3000;

app.use(express.json());

const livroDao = new LivroDao();

app.get('/livro', async(req, res) =>{
    try{
        const livros = await livroDao.busca();
        return res.status(200).json(livros);
    }catch(err){
        console.log("erro: "+ err);
        return res.status(500).json({
            mensagem:"Erro ao buscar livros"
        });
    }
});

app.listen(PORT, ()=>{
    console.log("serverOn");
});