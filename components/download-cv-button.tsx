"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DownloadCVButton() {
  const handleDownload = () => {
    // Crear un link temporal para descargar el CV
    const link = document.createElement("a");
    link.href = "/cv.pdf"; // El archivo debe estar en la carpeta public
    link.download = "Miguel_Chumacero_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Descargar CV
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Descargar CV?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de descargar el currículum vitae de Miguel Chumacero
            en formato PDF. El archivo se guardará en tu carpeta de descargas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDownload}>
            Sí, descargar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
