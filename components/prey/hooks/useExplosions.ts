import { useCallback, useState } from 'react';

export interface Explosion {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface Flash {
  id: number;
  x: number;
  y: number;
  color: string;
}

export function useExplosions() {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [flashes, setFlashes] = useState<Flash[]>([]);

  const createExplosion = useCallback((x: number, y: number, color: string) => {
    const explosionId = Date.now() + Math.random();
    
    // Crear flash primero
    const newFlash: Flash = {
      id: explosionId + 0.1,
      x,
      y,
      color,
    };
    
    // Crear explosión
    const newExplosion: Explosion = {
      id: explosionId,
      x,
      y,
      color,
    };

    setFlashes(prev => [...prev, newFlash]);
    
    // Agregar explosión con un pequeño delay para sincronizar con el flash
    setTimeout(() => {
      setExplosions(prev => [...prev, newExplosion]);
    }, 50);
  }, []);

  const removeExplosion = useCallback((id: number) => {
    setExplosions(prev => prev.filter(explosion => explosion.id !== id));
  }, []);

  const removeFlash = useCallback((id: number) => {
    setFlashes(prev => prev.filter(flash => flash.id !== id));
  }, []);

  return {
    explosions,
    flashes,
    createExplosion,
    removeExplosion,
    removeFlash,
  };
}