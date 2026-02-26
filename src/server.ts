import { cors } from 'cors';
import express from "express";
import "dotenv/config";

//config cors para permitir requisições de outros domínios

const app = express();

//utilização do cors para permitir requisições de outros domínios
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("funcionou o get");
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
