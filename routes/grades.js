import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;

    if (!grade.student || !grade.subject || !grade.type || !grade.value) {
      throw new Error('Algum campo está em branco');
    }

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

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(400).send({ error: err.message });
});

export default router;
