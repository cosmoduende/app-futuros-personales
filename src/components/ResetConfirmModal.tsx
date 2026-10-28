import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200"
        role="alertdialog"
        aria-labelledby="reset-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 id="reset-title" className="text-lg font-bold text-white">¿Reiniciar sesión de trabajo?</h3>
              <p className="text-xs text-slate-400">Esta acción borrará todas las respuestas en memoria.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Cancelar y cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-300">
          FuturoLab opera exclusivamente con datos en la memoria activa del navegador (sin cookies persistentes ni bases de datos). Al reiniciar, se restablecerán tus respuestas y volverás a la pantalla inicial.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            <Trash2 className="w-4 h-4" />
            Sí, reiniciar y borrar
          </button>
        </div>
      </div>
    </div>
  );
};
