
"use client";

import type { Dispatch, FC, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Tv, ArrowUp, ArrowDown, X, ClipboardPaste } from 'lucide-react';

interface CameraConfigurationProps {
  numCameras: number;
  setNumCameras: Dispatch<SetStateAction<number>>;
  cameraUrls: string[];
  setCameraUrls: Dispatch<SetStateAction<string[]>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  handleStartView: () => void;
}

export const CameraConfigurationComponent: FC<CameraConfigurationProps> = ({
  numCameras,
  setNumCameras,
  cameraUrls,
  setCameraUrls,
  errorMessage,
  setErrorMessage,
  handleStartView,
}) => {
  const handleNumCamerasChange = (value: number) => {
    setNumCameras(value);
    setErrorMessage("");
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...cameraUrls];
    newUrls[index] = value;
    setCameraUrls(newUrls);
    if (value.trim() !== "") {
       setErrorMessage("");
    }
  };

  const handleClearUrl = (index: number) => {
    const newUrls = [...cameraUrls];
    newUrls[index] = '';
    setCameraUrls(newUrls);
    setErrorMessage("");
  };

  const handleMoveUrl = (index: number, direction: 'up' | 'down') => {
    const newUrls = [...cameraUrls];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= numCameras) {
      return;
    }

    // Ensure all array elements up to numCameras are defined before swapping
    for (let i = 0; i < numCameras; i++) {
        if (newUrls[i] === undefined) newUrls[i] = '';
    }

    [newUrls[index], newUrls[targetIndex]] = [newUrls[targetIndex], newUrls[index]];
    setCameraUrls(newUrls);
    setErrorMessage("");
  };

  const handlePasteUrl = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const newUrls = [...cameraUrls];
        newUrls[index] = text;
        setCameraUrls(newUrls);
        setErrorMessage(""); 
      }
    } catch (err) {
      console.error("Error al pegar desde el portapapeles: ", err);
      setErrorMessage("No se pudo pegar. Verifica los permisos del portapapeles.");
    }
  };

  const viewOptions = [
    { value: 1, display: "1" },
    { value: 2, display: "2" },
    { value: 3, display: "3" },
    { value: 4, display: "4" },
  ];

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleStartView();
  };

  return (
    <Card className="mb-6 shadow-lg w-full h-full flex flex-col">
      <form onSubmit={handleFormSubmit}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Configuración de Vistas:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex-grow">
          <div>
            <Label className="text-base font-medium text-foreground mb-2 block">Cantidad de Ventanas:</Label>
            <div className="flex space-x-2 mt-2">
              {viewOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={numCameras === option.value ? "default" : "outline"}
                  onClick={() => handleNumCamerasChange(option.value)}
                  className="h-12 w-12 text-lg"
                  aria-label={`Seleccionar ${option.display} ventana${option.value > 1 ? 's' : ''}`}
                  type="button"
                >
                  {option.display}
                </Button>
              ))}
            </div>
          </div>

          <div>
              <Label className="text-base font-medium text-foreground mb-2 block pt-4">
                  URLs de las Vistas:
              </Label>
              <div className="space-y-3">
              {Array.from({ length: numCameras }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveUrl(index, 'up')}
                        disabled={index === 0}
                        aria-label="Mover URL hacia arriba"
                        className="bg-background hover:bg-accent/50"
                        type="button" 
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Input
                        id={`url-${index}`}
                        type="url"
                        placeholder={`URL Vista ${index + 1}`}
                        value={cameraUrls[index] || ''}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        className="bg-background flex-grow"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePasteUrl(index)}
                        aria-label="Pegar URL desde portapapeles"
                        className="bg-background hover:bg-accent/50"
                        type="button"
                    >
                        <ClipboardPaste className="h-4 w-4" />
                    </Button>
                    {cameraUrls[index] && (
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleClearUrl(index)}
                          aria-label="Limpiar URL"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          type="button"
                      >
                          <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveUrl(index, 'down')}
                        disabled={index === numCameras - 1}
                        aria-label="Mover URL hacia abajo"
                        className="bg-background hover:bg-accent/50"
                        type="button"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
              ))}
              </div>
          </div>

          {errorMessage && (
            <div className="flex items-center p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/30">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{errorMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end items-center pt-6">
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Tv className="mr-2 h-4 w-4" /> Iniciar Vista
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
