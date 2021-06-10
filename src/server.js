import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

fs.existsSync("./data.json");
const allData = fs.readFileSync("./data.json",'utf8')
let data = JSON.parse(allData).teste;



app.listen(4000, () => {
    console.log("Servidor Rodando na porta 4000!")
});