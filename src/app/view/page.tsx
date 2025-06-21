"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { X } from "lucide-react";
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";

function ViewPageContent() {
  const searchParams = useSearchParams();
  const urls: string[] = searchParams.getAll('urls').map((url: string) => decodeURIComponent(url));

  if (urls.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground p-4 items-center justify-center">
        <p className="mb-4">No se proporcionaron URLs de transmisión.</p>
        <Button asChild>
          <Link href="/">
            <X className="mr-2 h-4 w-4" /> Volver Atrás
          </Link>
        </Button>
      </div>
    );
  }

  const numIframes = urls.length;
  let gridContainerClasses = "grid gap-0 flex-grow w-full h-full";

  if (numIframes === 1) {
    gridContainerClasses += " grid-cols-1 grid-rows-1";
  } else if (numIframes === 2) {
    gridContainerClasses += " grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1";
  } else {
    gridContainerClasses += " grid-cols-1 md:grid-cols-2 grid-rows-auto"; 
  }
  
  return (
    <div className="relative flex flex-col h-screen bg-background text-foreground">
      <Link 
        href="/" 
        className="absolute top-2 right-2 z-20 p-2 rounded-md text-foreground hover:bg-accent/70 hover:text-accent-foreground transition-colors"
        aria-label="Cerrar Vista"
      >
        <X className="h-6 w-6" />
      </Link>
      
      <main className={gridContainerClasses}>
        {urls.map((url: string, index: number) => (
          <div
            key={index}
            className={`bg-muted/50 overflow-hidden
              ${numIframes === 3 && index === 0 ? 'md:col-span-2' : ''} 
              ${numIframes === 3 && index > 0 ? 'md:col-span-1' : ''}
            `}
          >
            <iframe
              src={url}
              title={`Stream ${index + 1}`}
              className="w-full h-full border-0 aspect-video min-h-[150px]"
              allowFullScreen
            />
          </div>
        ))}
        {numIframes === 3 && <div className="hidden md:block bg-muted/50" />}
      </main>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-4 items-center justify-center">
      <p>Cargando vistas...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ViewPageContent />
    </Suspense>
  );
}
