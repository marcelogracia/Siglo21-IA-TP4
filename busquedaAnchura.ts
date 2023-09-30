//Definición de una clase Grafo para representar el grafo de la planta industrial:

class Grafo {
  nodos: Map<string, string[]>;

  constructor() {
    this.nodos = new Map();
  }

  agregarNodo(nombre: string, vecinos: string[]): void {
    this.nodos.set(nombre, vecinos);
  }

  obtenerVecinos(nodo: string): string[] {
    return this.nodos.get(nodo) || [];
  }
}

//Creación del grafo de ejemplo que represente la planta industrial con nodos y conexiones:
const grafo = new Grafo();
grafo.agregarNodo("A", ["B", "C"]);
grafo.agregarNodo("B", ["D", "E"]);
grafo.agregarNodo("C", ["F"]);
grafo.agregarNodo("D", ["G"]);
grafo.agregarNodo("E", ["H", "I"]);
grafo.agregarNodo("F", []);
grafo.agregarNodo("G", []);
grafo.agregarNodo("H", []);
grafo.agregarNodo("I", []);



//Implementamos la búsqueda en profundidad (DFS) para encontrar un camino desde un nodo inicial hasta un nodo objetivo en el grafo


function busquedaAnchura(grafo: Grafo, inicio: string, objetivo: string): string[] | null {
  const visitados: Set<string> = new Set();
  const cola: string[] = [inicio];
  const padre: Map<string, string> = new Map(); // Agregamos el mapa de padres

  while (cola.length > 0) {
    const nodoActual = cola.shift()!;
    visitados.add(nodoActual);

    if (nodoActual === objetivo) {
      // Se encontró un camino al objetivo, reconstruir el camino
      const camino: string[] = [];
      let nodo = objetivo;
      while (nodo !== inicio) {
        camino.unshift(nodo);
        nodo = padre.get(nodo)!;
      }
      camino.unshift(inicio);
      return camino;
    }

    for (const vecino of grafo.obtenerVecinos(nodoActual)) {
      if (!visitados.has(vecino) && !cola.includes(vecino)) {
        cola.push(vecino);
        padre.set(vecino, nodoActual); // Almacenamos el nodo padre
      }
    }
  }

  // No se encontró un camino al objetivo
  return null;
}

// Nodo inicial y nodo objetivo
const inicio = "A";
const objetivo = "I";

// Realizar la búsqueda DFS
const caminoEncontrado = busquedaAnchura(grafo, inicio, objetivo);

if (caminoEncontrado) {
  console.log(`Camino encontrado de ${inicio} a ${objetivo}: ${caminoEncontrado.join(" -> ")}`);
} else {
  console.log(`No se encontró un camino de ${inicio} a ${objetivo}`);
}