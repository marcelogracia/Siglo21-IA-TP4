import cv2
import numpy as np
import matplotlib.pyplot as plt

def hough_circle_transform(image_path, min_radius, max_radius, param1=50, param2=30):
    # Cargar la imagen
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    # Aplicar el suavizado Gaussiano para reducir el ruido
    blurred = cv2.GaussianBlur(image, (9, 9), 2)
    
    # Aplicar la Transformada de Hough de círculos
    circles = cv2.HoughCircles(blurred, cv2.HOUGH_GRADIENT, dp=1, minDist=20,
                               param1=param1, param2=param2, minRadius=min_radius, maxRadius=max_radius)
    
    # Dibujar los círculos detectados en la imagen original
    output_image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    if circles is not None:
        circles = np.uint16(np.around(circles))
        for i in circles[0, :]:
            cv2.circle(output_image, (i[0], i[1]), i[2], (0, 255, 0), 2)  # Dibujar el círculo
            cv2.circle(output_image, (i[0], i[1]), 2, (0, 0, 255), 3)  # Dibujar el centro
    
    return output_image

# Ruta de la imagen de entrada
image_path = 'c3.jpg'  # Reemplazar con el nombre de la imágen c3.jpg

# Parámetros de la Transformada de Hough de círculos
min_radius_value = 10
max_radius_value = 50

# Obtener la imagen con círculos detectados
result_image = hough_circle_transform(image_path, min_radius_value, max_radius_value)

# Mostrar la imagen resultante
plt.imshow(cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB))
plt.title('Transformada de Hough de Circunferencias')
plt.show()