const { default: clientPromise } = require("../lib/mongodb");

const client = await clientPromise;
const db = client.db('historias');

const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numeros = '0123456789';

export async function generarCodigoUnico(): Promise<string> {
  let codigo = '';
  let existe = true;

  while (existe) {
    const letrasAleatorias = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
    const numerosAleatorios = Array.from({ length: 3 }, () => numeros[Math.floor(Math.random() * numeros.length)]).join('');
    codigo = letrasAleatorias + numerosAleatorios;

    const existeCodigo = await db.collection('reservas').findOne({ codigo });
    if (!existeCodigo) existe = false;
  }

  return codigo;
}