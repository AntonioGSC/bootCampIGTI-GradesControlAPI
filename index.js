import express from 'express';
import { promises as fs } from 'fs';
import gradesRouter from './routes/grades.js';

const app = express();
const { readFile, writeFile } = fs;
global.fileName = 'grades.json';

app.use(express.json());
app.use('/grades', gradesRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    console.log('API Started!');
  } catch (err) {
    console.log(err);
    console.log('grades.json não encontrado');
  }
});
