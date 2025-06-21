
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { WelcomeMessage } from '@/components/welcome-message';
import { ChannelListComponent } from '@/components/channel-list';
import { CameraConfigurationComponent } from '@/components/camera-configuration';

export default function HomePage() {
  const [numCameras, setNumCameras] = useState<number>(1);
  const [cameraUrls, setCameraUrls] = useState<string[]>(Array(4).fill(''));
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedUrls = localStorage.getItem('cameraUrls');
    const storedNumCameras = localStorage.getItem('numCameras');
    if (storedUrls) {
      setCameraUrls(JSON.parse(storedUrls));
    }
    if (storedNumCameras) {
      setNumCameras(parseInt(storedNumCameras, 10));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cameraUrls', JSON.stringify(cameraUrls));
      localStorage.setItem('numCameras', numCameras.toString());
    }
  }, [cameraUrls, numCameras, isMounted]);

  const handleStartView = () => {
    setErrorMessage('');
    const activeUrls = cameraUrls.slice(0, numCameras);
    const allUrlsFilled = activeUrls.every(url => url && url.trim() !== '');

    if (!allUrlsFilled) {
      setErrorMessage(`Por favor, ingrese las URLs para ${numCameras === 1 ? 'la vista seleccionada' : `las ${numCameras} vistas seleccionadas`}.`);
      return;
    }

    const queryParams = new URLSearchParams();
    activeUrls.forEach(url => queryParams.append('urls', encodeURIComponent(url)));
    router.push(`/view?${queryParams.toString()}`);
  };
  
  if (!isMounted) {
    // Optional: render a loading state or null to avoid hydration mismatch issues with localStorage
    return null; 
  }

  return (
    <AppShell>
      <WelcomeMessage />
      
      {/* Contenedor principal para el diseño de dos columnas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Columna izquierda: Lista de Canales */}
        <div className="flex">
          <ChannelListComponent />
        </div>
        
        {/* Columna derecha: Configuración de Vistas */}
        <div className="flex">
          <CameraConfigurationComponent
            numCameras={numCameras}
            setNumCameras={setNumCameras}
            cameraUrls={cameraUrls}
            setCameraUrls={setCameraUrls}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            handleStartView={handleStartView}
          />
        </div>
      </div>
    </AppShell>
  );
}
