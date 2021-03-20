const fs = require('fs/promises');
const path = require('path');
const NotFoundError = require('./errors/not-found');
const ConflictError = require('./errors/conflict-error');

const dataPath = path.join(__dirname, '../../data/subscribers');

async function readJSON(filePath) {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' });

  return JSON.parse(content.toString());
}

async function writeJSON(filePath, content) {
  return fs.writeFile(
    filePath,
    JSON.stringify(content, null, 2),
    { encoding: 'utf-8' },
  );
}

async function getAll() {
  const files = await fs.readdir(dataPath);
  const entries = files.filter((file) => !file.startsWith('.'));

  return Promise.all(entries.map((entry) => readJSON(path.join(dataPath, entry))));
}

async function get(id) {
  const filePath = path.join(dataPath, `${id}.json`);

  try {
    return await readJSON(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') return null;

    throw err;
  }
}

async function create(id, content) {
  const filePath = path.join(dataPath, `${id}.json`);

  try {
    await fs.access(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;

    await writeJSON(filePath, content);
    return;
  }

  throw new ConflictError(`Entry ${id} already exist`);
}

async function update(id, content) {
  const filePath = path.join(dataPath, `${id}.json`);

  await fs.access(filePath).catch((e) => {
    if (e.code === 'ENOENT') throw new NotFoundError('Not Found', e);

    throw e;
  });
  await writeJSON(filePath, content);
}

async function remove(id) {
  const filePath = path.join(dataPath, `${id}.json`);

  await fs.rm(filePath).catch((e) => {
    if (e.code === 'ENOENT') throw new NotFoundError('Not Found', e);

    throw e;
  });
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
};
