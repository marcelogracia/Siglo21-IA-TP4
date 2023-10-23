const fs = require('fs');
const PNG = require('pngjs').PNG;
const math = require('mathjs');

// Directorio que contiene las imágenes de referencia
const referenceImagesDirectory = 'reference_images';

// Directorio que contiene las imágenes de prueba con ruido
const testImagesDirectory = 'test_images';

// Función para cargar una imagen PNG desde un archivo
function loadImageFromPath(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG())
      .on('parsed', function () {
        const image = [];
        for (let y = 0; y < this.height; y++) {
          const row = [];
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            // Convertir valores RGBA a binario (0 o 1)
            row.push(this.data[idx] ? 1 : 0);
          }
          image.push(row);
        }
        resolve(image);
      })
      .on('error', (err) => reject(err));
  });
}

// Función para entrenar el modelo de Hopfield con imágenes de referencia
function trainHopfieldModel(referenceImages) {
  const imageHeight = referenceImages[0].length;
  const imageWidth = referenceImages[0][0].length;
  const patternSize = imageHeight * imageWidth;
  let weights = math.zeros(patternSize, patternSize);

  referenceImages.forEach((referenceImage) => {
    const flatReferenceImage = flattenMatrix(referenceImage);
    weights = math.add(weights, math.multiply(flatReferenceImage, math.transpose(flatReferenceImage)));
  });

  // Restar la matriz de identidad para que los valores diagonales sean 0
  for (let i = 0; i < patternSize; i++) {
    weights[i][i] = 0;
  }

  return weights;
}

// Función para identificar un patrón en una imagen dada utilizando el modelo de Hopfield
function identifyPattern(testImage, hopfieldWeights) {
  const flatTestImage = flattenMatrix(testImage);

  const result = math.multiply(hopfieldWeights, flatTestImage);
  const identifiedPattern = result.map((value) => (value >= 0 ? 1 : 0));

  return identifiedPattern;
}

// Función para convertir una matriz 2D en un vector 1D
function flattenMatrix(matrix) {
  return matrix.reduce((acc, row) => acc.concat(row), []);
}

// Cargar imágenes de referencia desde el directorio
const referenceImages = [];

fs.readdirSync(referenceImagesDirectory).forEach((file) => {
  console.log(file)
  if (file.endsWith('.png')) {
    const referenceImagePath = `${referenceImagesDirectory}/${file}`;
    const referenceImage = loadImageFromPath(referenceImagePath);
    referenceImages.push(referenceImage);
  }
});

// Cargar una imagen de prueba con ruido desde el directorio
const testImageFile = 'test_image2.png';
const testImage = loadImageFromPath(`${testImagesDirectory}/${testImageFile}`);

Promise.all(referenceImages)
  .then((loadedReferenceImages) => {
    // Entrenar el modelo de Hopfield con las imágenes de referencia
    const hopfieldWeights = trainHopfieldModel(loadedReferenceImages);

    // Identificar el patrón en la imagen de prueba
    const identifiedPattern = identifyPattern(testImage, hopfieldWeights);

    console.log('Patrón identificado:');
    console.log(identifiedPattern);
  })
  .catch((err) => console.error('Error al cargar imágenes de referencia:', err));
