const math = require('mathjs');

// Definición de patrones de referencia para las letras 'A', 'B' y 'C' en una matriz binaria
const patternA = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
];

const patternB = [
  [1, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 0],
];

const patternC = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
];

// Función para convertir una matriz 2D en un vector 1D
function flattenMatrix(matrix) {
  return matrix.reduce((acc, row) => acc.concat(row), []);
}

// Función para entrenar el modelo de Hopfield con patrones de referencia
function trainHopfieldModel(referencePatterns) {
  const patternSize = referencePatterns[0].length;
  let weights = math.zeros(patternSize, patternSize);

  referencePatterns.forEach((pattern) => {
    const flatPattern = flattenMatrix(pattern);
    weights = math.add(weights, math.multiply(flatPattern, math.transpose(flatPattern)));
  });

  // Restar la matriz de identidad para que los valores diagonales sean 0
  for (let i = 0; i < patternSize; i++) {
    weights[i][i] = 0;
  }

  return weights;
}

// Función para identificar un patrón en una imagen dada utilizando el modelo de Hopfield
function identifyPattern(testPattern, hopfieldWeights) {
  const flatTestPattern = flattenMatrix(testPattern);

  const result = math.multiply(hopfieldWeights, flatTestPattern);
  const identifiedPattern = result.map((value) => (value >= 0 ? 1 : 0));

  return identifiedPattern;
}

// Función para agregar ruido a un patrón
function addNoise(pattern, noiseLevel) {
  const noisyPattern = pattern.map((row) =>
    row.map((bit) => (Math.random() < noiseLevel ? 1 - bit : bit))
  );
  return noisyPattern;
}

// Entrenar el modelo de Hopfield con patrones de referencia
const hopfieldWeights = trainHopfieldModel([patternA, patternB, patternC]);

// Crear una imagen de prueba con ruido (en este caso, la letra 'A' con ruido)
const noisyTestPattern = addNoise(patternA, 0.2);

// Identificar el patrón en la imagen de prueba
const identifiedPattern = identifyPattern(noisyTestPattern, hopfieldWeights);

// Mostrar los resultados
console.log('Patrón de referencia:');
console.log(patternA);
console.log('Imagen de prueba con ruido:');
console.log(noisyTestPattern);
console.log('Patrón identificado:');
console.log(identifiedPattern);
