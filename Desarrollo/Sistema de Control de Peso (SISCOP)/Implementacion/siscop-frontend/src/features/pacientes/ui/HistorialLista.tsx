import React, { useState } from 'react';
import { FileText, Printer, Edit } from 'lucide-react';
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer || Buffer;
}
import type { Evaluacion } from '../../../mocks/mockPacientes';
import { MOCK_PACIENTES } from '../../../mocks/mockPacientes';
import ModalVisorPdf from '../../../components/ModalVisorPdf';
import { ReportePDF } from '../../../components/ReportePDF';

interface HistorialListaProps {
  evaluaciones: Evaluacion[];
  todasLasEvaluaciones: Evaluacion[];
  isNutricionista: boolean;
  pacienteId?: string;
  onVerRegistro: (ev: Evaluacion) => void;
  onEditarRegistro: (ev: Evaluacion) => void;
}

export function HistorialLista({
  evaluaciones,
  todasLasEvaluaciones,
  isNutricionista,
  pacienteId,
  onVerRegistro,
  onEditarRegistro,
}: HistorialListaProps) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('reporte.pdf');
  const [showModal, setShowModal] = useState(false);

  const displayFecha = (fechaStr: string) => fechaStr.replace(/-/g, ' / ');

  const handlePrintPDF = async (ev: Evaluacion) => {
    const { pdf } = await import('@react-pdf/renderer');
    const paciente = MOCK_PACIENTES.find(p => p.id === (pacienteId || ev.pacienteId));

    const evaluationWithPatient = { ...ev, paciente };

    const blob = await pdf(<ReportePDF evaluacion={evaluationWithPatient} />).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfBlobUrl(url);
    setPdfFileName(`${paciente?.documento || 'paciente'}-${ev.fecha}.pdf`);
    setShowModal(true);
  };

  if (evaluaciones.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">
          No se encontraron evaluaciones con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evaluaciones.map((ev) => {
        const esEditable = todasLasEvaluaciones[0]?.id === ev.id;
        return (
          <div
            key={ev.id}
            className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-colors shadow-none"
          >
            <div className="w-1/3" />
            <div className="text-center w-1/3 text-sm font-semibold text-slate-700 select-none">
              {displayFecha(ev.fecha)}
            </div>
            <div className="w-1/3 flex justify-end items-center gap-4">
              <button
                onClick={() => onVerRegistro(ev)}
                className="text-slate-400 hover:text-[#1A82C4] cursor-pointer transition-colors p-1"
                title="Ver Registro"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePrintPDF(ev)}
                className="text-slate-400 hover:text-[#1A82C4] cursor-pointer transition-colors p-1"
                title="Ver PDF"
              >
                <Printer className="w-5 h-5" />
              </button>
              {isNutricionista && esEditable && (
                <button
                  onClick={() => onEditarRegistro(ev)}
                  className="text-[#1A82C4] hover:text-[#156fa9] cursor-pointer transition-colors p-1"
                  title="Editar Registro"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      {showModal && pdfBlobUrl && (
        <ModalVisorPdf
          pdfUrl={pdfBlobUrl}
          fileName={pdfFileName}
          onClose={() => {
            setShowModal(false);
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
          }}
        />
      )}
    </div>
  );
}
