import express from 'express';
import { promises as fs, write } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

function valida(grade) {
  if (!grade.student || !grade.subject || !grade.type || grade.value == null) {
    throw new Error('Algum campo está em branco');
  }
}

function validaIndex(index) {
  if (index === -1) {
    throw new Error('Registro não encontrado');
  }
}

router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;

    valida(grade);

    const data = JSON.parse(await readFile(global.fileName));

    grade = {
      id: data.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      value: grade.value,
      timestamp: new Date(),
    };

    data.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    console.log(grade);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const grade = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.grades.findIndex((a) => a.id === grade.id);

    valida(grade);
    validaIndex(index);

    data.grades[index].student = grade.student;
    data.grades[index].subject = grade.subject;
    data.grades[index].type = grade.type;
    data.grades[index].value = grade.value;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    console.log(grade);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.grades.findIndex(
      (a) => a.id === parseInt(req.params.id)
    );

    validaIndex(index);

    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    console.log('Conta ' + req.params.id + ' removida com sucesso');
    res.send('Conta ' + req.params.id + ' removida com sucesso');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.grades.findIndex(
      (a) => a.id === parseInt(req.params.id)
    );

    validaIndex(index);

    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    console.log(grade);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(400).send({ error: err.message });
});

export default router;
