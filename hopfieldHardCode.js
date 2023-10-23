const math = require('mathjs');

// Definir el tamaño de la imagen y el patrón de referencia "X"
const imageSize = 4;
const patternX = [
  [1, 0, 0, 1],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
];

// Función para convertir una matriz 2D en un vector 1D
function flattenMatrix(matrix) {
  return matrix.reduce((acc, row) => acc.concat(row), []);
}

// Función para entrenar el modelo de Hopfield con un patrón
function trainHopfieldModel(pattern) {
  const flatPattern = flattenMatrix(pattern);
  const weights = math.multiply(flatPattern, math.transpose(flatPattern));
  // Restar la matriz de identidad para que los valores diagonales sean 0
  for (let i = 0; i < weights.length; i++) {
    weights[i][i] = 0;
  }
  return weights;
}

// Función para identificar un patrón en una imagen dada
function identifyPattern(image, weights) {
  const flatImage = flattenMatrix(image);
  const result = math.multiply(weights, flatImage);
  // Aplicar función de umbral: si el valor es positivo, se considera 1; de lo contrario, 0.
  const identifiedImage = result.map((value) => (value >= 0 ? 1 : 0));
  return math.reshape(identifiedImage, [imageSize, imageSize]);
}

// Entrenar el modelo con el patrón "X"
const hopfieldWeights = trainHopfieldModel(patternX);

// Presentar una imagen de prueba con ruido
const testImage = [
  [1, 0, 0, 1],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
];

// Identificar el patrón en la imagen de prueba
const identifiedImage = identifyPattern(testImage, hopfieldWeights);

// Mostrar los resultados
console.log('Patrón de referencia:');
console.log(patternX);
console.log('Imagen identificada:');
console.log(identifiedImage);
