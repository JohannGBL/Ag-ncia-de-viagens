const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

   // Configuração da conexão com o banco de dados
   const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Trocar pelo seu usuário do MySQL
    password: 'root', // Trocar pela sua senha do MySQL
    database: 'agencia_viagens',
});

// Middleware para análise de corpos de requisição
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados!');
    }
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Rota para cadastrar viagens
app.post('/', function(req,res){
 
    //captura e armazenamento dos campos do formulário html
    const destino = req.body.destino;
    const data_viagem = req.body.data_viagem;
    const preco = req.body.preco ;
    const vagas = req.body.vagas ;
 
    const values = [destino, data_viagem, preco, vagas ];
    const insert = "INSERT INTO viagens (destino, data_viagem, preco, vagas) VALUES (?,?,?,?)"
 
    db.query(insert, values, function(err,result){
        if(!err){
            console.log("Dados inseridos com sucesso!");
            res.redirect('/listar');
        }else{
            console.log("Não foi possível inserir os dados ", err);
            res.send("Erro!")
        }
    })
});

// Rota para listar viagens
app.get('/listar', function(req,res){
    const listar = "SELECT * FROM viagens";

    db.query(listar, function(err, rows){
        if(!err){
            console.log("Consulta realizada com sucesso!");
            res.send(`
                <html>
                <head>
                <title> Relatório de estoque </title>
                </head>
                <body>
                <style>/* style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --light-color: #ecf0f1;
    --dark-color: #2c3e50;
    --success-color: #2ecc71;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    background-color: #f5f7fa;
    color: var(--dark-color);
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 30px;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--secondary-color);
}

/* Estilos da Tabela */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
    background-color: white;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    overflow: hidden;
}

th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
}

tr:nth-child(even) {
    background-color: #f8f9fa;
}

tr:hover {
    background-color: #f1f1f1;
}

/* Destaques para dados importantes */
td:nth-child(4) { /* Coluna de preço */
    color: var(--accent-color);
    font-weight: bold;
}

td:nth-child(5) { /* Coluna de vagas */
    font-weight: bold;
}

/* Botão/Link Voltar */
.back-link {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 25px;
    background-color: var(--secondary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: bold;
    transition: all 0.3s ease;
}

.back-link:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    h1 {
        font-size: 1.8rem;
    }
    
    table {
        display: block;
        overflow-x: auto;
    }
    
    th, td {
        padding: 10px;
        font-size: 0.9rem;
    }
}

/* Efeitos para poucas vagas */
.low-vacancy {
    color: var(--accent-color);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
} </style>
                    <div class="container">
                        <h1>Relatório de Viagens</h1>

                        <table>
                            <tr>
                                <th>Código</th>
                                <th>Destino</th>
                                <th>Data da Viagem</th>
                                <th>Preço (R$)</th>
                                <th>Vagas</th>
                                <th>Ações</th>
                                <th>Ações</th>
                               
                            </tr>
                            ${rows.map(row => `
                                <tr>
                                <td>${row.id}</td>
                                <td>${row.destino}</td>
                                <td>${new Date(row.data_viagem).toLocaleDateString('pt-BR')}</td>
                                <td>${row.preco}</td>
                                <td>${row.vagas}</td>
                                <td><a href="/excluir/${row.id}">🗑</a> </td>
                                <td><a href="/editar/${row.id}">Editar</a></td>
                                </tr>
                            `).join('')}
                        </table>
                        <a href="/" class="back-link">Voltar</a>
                    </div>
                </body>
                </html>
                `);
        } else {
            console.log("Erro no relatório de estoque ", err);
            res.send("Erro")
        }
    })
});
app.get('/excluir/:id', function(req, res){
    const id = req.params.id;

    db.query('DELETE FROM viagens WHERE id = ?', [id], function(err, result) {
        if (err) {
            console.error('Erro ao excluir o produto: ', err);
            res.status(500).send('Erro interno ao excluir o produto.');
            return;
        }

        console.log("Produto excluido com sucesso!")
        res.redirect('/listar');
    });
});

app.get('/editar/:id', function(req, res){
    const id = req.params.id; // Obtém o ID do produto a ser editado da URL
    const select = "SELECT * FROM viagens WHERE id = ?";
   
    db.query(select, [id], function(err, rows){
        if(!err){
            console.log("viagem encontrado com sucesso!");
            res.send(`
                <html>
                
                    <head>
                        <title> Editar viagem </title>
                    </head>
                    <body>
                    <style>
/* style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    --light-color: #ecf0f1;
    --dark-color: #2c3e50;
    --success-color: #2ecc71;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    background-color: #f5f7fa;
    color: var(--dark-color);
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 30px;
    text-align: center;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--secondary-color);
}

form {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--primary-color);
}

input[type="text"],
input[type="date"],
input[type="number"] {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus {
    border-color: var(--secondary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

input[type="submit"] {
    background-color: var(--secondary-color);
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

input[type="submit"]:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
    
    h1 {
        font-size: 1.8rem;
    }
    
    form {
        padding: 20px;
    }
    
    input[type="text"],
    input[type="date"],
    input[type="number"] {
        padding: 10px;
        font-size: 0.9rem;
    }
}
</style>
    <h1>Editar viagem</h1>
        <form action="/editar/${id}" method="POST">
        <label for="destino">Destino:</label><br>
        <input type="text" name="destino" value="${rows[0].destino}"><br><br>
        <label for="data_viagem">Data viagem:</label><br>
        <input type="date" name="data_viagem" value="${rows[0].data_viagem}"><br><br>
        <label for="preco">Preço:</label><br>
        <input type="number" name="preco" value="${rows[0].preco}"><br><br>                         
        <label for="vagas">Vagas:</label><br>
        <input type="text" name="vagas" value="${rows[0].vagas}"><br><br>
        <input type="submit" value="Salvar">                            
    </form>
    </body>
    </html>`);
}else{
     console.log("Erro ao buscar a viagem ", err);
     res.send("Erro")
}
});
});  

app.post('/editar/:id', function(req, res){
    const id = req.params.id; // Obtém o ID do produto a ser editado da URL
    const destino = req.body.destino; // Obtém a nova descrição do corpo da requisição
    const data_viagem = req.body.data_viagem; // Obtém a nova quantidade do corpo da requisição
    const preco = req.body.preco; // Obtém o novo valor unitário do corpo da requisiçã
    const vagas = req.body.vagas;
 
    const update = "UPDATE viagens SET destino = ?, data_viagem = ?, preco = ?, vagas = ? WHERE id = ?";
 
    db.query(update, [destino, data_viagem, preco, vagas, id], function(err, result){
        if(!err){
            console.log("Viagem editado com sucesso!");
            res.redirect('/listar'); // Redireciona para a página de listagem após a edição
        }else{
            console.log("Erro ao editar a viagem ", err);
            res.send("Erro")
        }
    });
});
// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});

