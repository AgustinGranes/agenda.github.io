import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function WelcomeMessage() {
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">MultiViewer for Sports.</CardTitle>
        <CardDescription className="text-center text-muted-foreground pt-2">
          Pega los enlaces de las transmisiones que quieres ver a continuación. Configura la cantidad de vistas y ¡a disfrutar!
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
