import React, { useEffect } from 'react';
import { Download, X } from 'lucide-react';


export default function PdfViewerModal({ pdfUrl, onClose, fileName = "reporte.pdf" }: { pdfUrl: string; onClose: () => void; fileName?: string }) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = fileName;
    return () => {
      document.title = originalTitle;
    };
  }, [fileName]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] relative shadow-lg flex flex-col overflow-hidden">

        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-700">Visor de PDF</h3>
          <div className="flex items-center gap-4">
            <a
              href={pdfUrl}
              download={fileName}
              className="bg-[#1A82C4] hover:bg-[#156fa9] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition-colors p-1"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visor PDF nativo */}
        <div className="flex-1 w-full bg-gray-100">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="Visor nativo de PDF"
          />
        </div>

      </div>
    </div>
  );
}
