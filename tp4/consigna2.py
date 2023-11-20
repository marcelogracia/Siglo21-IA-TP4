import cv2
import numpy as np
import matplotlib.pyplot as plt

def hough_transform(image_path, threshold):
    # Cargar la imagen
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    # Aplicar el detector de bordes (Canny)
    edges = cv2.Canny(image, 50, 150, apertureSize=3)
    
    # Aplicar la Transformada de Hough
    lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold)
    
    # Dibujar las líneas detectadas en la imagen original
    output_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    if lines is not None:
        for line in lines:
            rho, theta = line[0]
            a, b = np.cos(theta), np.sin(theta)
            x0, y0 = a * rho, b * rho
            x1, y1 = int(x0 + 1000 * (-b)), int(y0 + 1000 * (a))
            x2, y2 = int(x0 - 1000 * (-b)), int(y0 - 1000 * (a))
            cv2.line(output_image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    
    return output_image

# Ruta de la imagen de entrada
image_path = 'c2.jpg'  # Reemplaza 'tu_imagen.jpg' con la ruta de tu imagen

# Umbral para la Transformada de Hough (ajustarlo según las necesidades)
threshold_value = 100

# Obtener la imagen con líneas detectadas
result_image = hough_transform(image_path, threshold_value)

# Mostrar la imagen resultante
plt.imshow(cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB))
plt.title('Transformada de Hough de Rectas')
plt.show()