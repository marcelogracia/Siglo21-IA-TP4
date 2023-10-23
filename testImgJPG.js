const fs = require('fs');
const JPEG = require('jpeg-js'); // Asegúrate de utilizar una librería que sea compatible con imágenes JPEG.
const math = require('mathjs');

// Directorio que contiene las imágenes de referencia en formato JPG
const referenceImagesDirectory = './reference_images';

// Directorio que contiene las imágenes de prueba con ruido en formato JPG
const testImagesDirectory = './test_images';

// Función para cargar una imagen JPEG desde un archivo
function loadImageFromPath(filePath) {
  return new Promise((resolve, reject) => {
    const jpegData = fs.readFileSync(filePath);
    const rawImageData = JPEG.decode(jpegData);

    const image = [];
    for (let y = 0; y < rawImageData.height; y++) {
      const row = [];
      for (let x = 0; x < rawImageData.width; x++) {
        const idx = (rawImageData.width * y + x) << 2;
        // Convertir valores RGBA a binario (0 o 1)
        row.push(rawImageData.data[idx] ? 1 : 0);
      }
      image.push(row);
    }

    resolve(image);
  });
}

// Resto del código permanece sin cambios

// Función para entrenar el modelo de Hopfield con imágenes de referencia
function trainHopfieldModel(referenceImages) {
    console.log('Traing...', referenceImages)
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
    
    if (file.endsWith('.jpg')) {
      const referenceImagePath = `${referenceImagesDirectory}/${file}`;
      const referenceImage = loadImageFromPath(referenceImagePath);
      referenceImages.push(referenceImage);
    }
  });
  
  // Cargar una imagen de prueba con ruido desde el directorio
  const testImageFile = 'test_image.jpg';
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
  