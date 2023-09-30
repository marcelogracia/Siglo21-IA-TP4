class PlantaIndustrial {
    segmentos: number;
    posicionInicial: number;
    posicionDeseada: number;
  
    constructor(segmentos: number, posicionInicial: number, posicionDeseada: number) {
      this.segmentos = segmentos;
      this.posicionInicial = posicionInicial;
      this.posicionDeseada = posicionDeseada;
    }
  
    // Heurística: Distancia manhattan entre la posición actual y la deseada
    heuristica(posicionActual: number): number {
      return Math.abs(this.posicionDeseada - posicionActual);
    }
  
    // Operaciones: Mover un segmento a la izquierda o a la derecha
    obtenerOperaciones(posicionActual: number): { nombre: string; desplazamiento: number }[] {
      const operaciones: { nombre: string; desplazamiento: number }[] = [];
      if (posicionActual > 0) {
        operaciones.push({ nombre: 'Mover a la izquierda', desplazamiento: -1 });
      }
      if (posicionActual < this.segmentos - 1) {
        operaciones.push({ nombre: 'Mover a la derecha', desplazamiento: 1 });
      }
      return operaciones;
    }
  
    // Función para encontrar la secuencia de operaciones óptima utilizando A*
    encontrarSecuenciaOptima(): string[] | null {
      const abierto: {
        posicionActual: number;
        secuenciaOperaciones: string[];
        costo: number;
        heuristica: number;
      }[] = [];
      const cerrado: Set<number> = new Set();
  
      abierto.push({
        posicionActual: this.posicionInicial,
        secuenciaOperaciones: [],
        costo: 0,
        heuristica: this.heuristica(this.posicionInicial),
      });
  
      while (abierto.length > 0) {
        abierto.sort((a, b) => a.costo + a.heuristica - b.costo - b.heuristica);
        const nodoActual = abierto.shift();
  
        if (nodoActual!.posicionActual === this.posicionDeseada) {
          return nodoActual!.secuenciaOperaciones;
        }
  
        cerrado.add(nodoActual!.posicionActual);
  
        const operaciones = this.obtenerOperaciones(nodoActual!.posicionActual);
        for (const operacion of operaciones) {
          const nuevaPosicion = nodoActual!.posicionActual + operacion.desplazamiento;
          if (!cerrado.has(nuevaPosicion)) {
            const nuevaSecuencia = [...nodoActual!.secuenciaOperaciones, operacion.nombre];
            const nuevoCosto = nodoActual!.costo + 1; // Suponemos que todas las operaciones tienen el mismo costo
            const nuevaHeuristica = this.heuristica(nuevaPosicion);
            abierto.push({
              posicionActual: nuevaPosicion,
              secuenciaOperaciones: nuevaSecuencia,
              costo: nuevoCosto,
              heuristica: nuevaHeuristica,
            });
          }
        }
      }
  
      return null; // No se encontró una solución
    }
  }
  
  // Crear una instancia de la planta industrial con 10 segmentos
  const planta = new PlantaIndustrial(10, 10, 7); // 10 segmentos, posición inicial 2, posición deseada 7
  
  // Encontrar la secuencia óptima de operaciones
  const secuenciaOptima = planta.encontrarSecuenciaOptima();
  
  console.log('Secuencia óptima de operaciones:', secuenciaOptima);