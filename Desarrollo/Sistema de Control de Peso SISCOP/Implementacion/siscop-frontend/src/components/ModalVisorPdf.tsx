import { useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-5xl h-[90vh] shadow-xl border border-slate-100 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h3 className="text-xl font-semibold text-slate-900">Visor de PDF</h3>
          <div className="flex items-center gap-4">
            <a
              href={pdfUrl}
              download={fileName}
              className="bg-[#1A82C4] hover:bg-[#156fa9] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </a>
            <button
              onClick={onClose}
              className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>
        </div>

        {/* Visor PDF nativo */}
        <div className="flex-1 w-full bg-slate-50">
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

