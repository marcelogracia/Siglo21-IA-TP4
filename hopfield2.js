const fs = require('fs');
const PNG = require('pngjs').PNG;
const math = require('mathjs');

// Directorio donde se encuentran las imágenes de prueba
const imagesDirectory = './images';

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

// Función para cargar una imagen PNG desde un archivo
function loadImageFromPath(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
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

// Directorio donde se encuentran las imágenes de referencia
const referenceImages = [];

// Cargar imágenes de referencia desde el directorio
fs.readdirSync(imagesDirectory).forEach((file) => {
  if (file.endsWith('.png')) {
    referenceImages.push(loadImageFromPath(`${imagesDirectory}/${file}`));
  }
});

Promise.all(referenceImages)
  .then((loadedImages) => {
    // Entrenar el modelo de Hopfield con imágenes de referencia
    const hopfieldWeights = trainHopfieldModel(loadedImages[0]);

    // Presentar una imagen de prueba desde el mismo directorio
    loadImageFromPath(`${imagesDirectory}/test.png`)
      .then((testImage) => {
        // Identificar el patrón en la imagen de prueba
        const identifiedImage = identifyPattern(testImage, hopfieldWeights);
        // Mostrar los resultados
        console.log('Imagen de referencia:');
        console.log(loadedImages[0]);
        console.log('Imagen identificada:');
        console.log(identifiedImage);
      })
      .catch((err) => console.error('Error al cargar la imagen de prueba:', err));
  })
  .catch((err) => console.error('Error al cargar imágenes de referencia:', err));
