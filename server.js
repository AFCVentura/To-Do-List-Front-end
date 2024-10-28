import express from "express";
import cors from "cors";

const PORT = 4000;

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/auth/register", (req, res) => {
  const body = req.body;
  console.log("recebido: ", body);
  res.send('afhsufwrhrfu34r332932923rhfwh2423');
});

app.listen(PORT, () => {
  console.log("Servidor ouvindo na porta ", PORT);
});