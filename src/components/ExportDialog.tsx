import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';
import { Download, X, FileText, Book, Loader2 } from 'lucide-react';
import { Story } from '../services/api';
import { useExportStore } from '../store/exportStore';

interface ExportDialogProps {
  story: Story;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ story }) => {
  const [open, setOpen] = useState(false);
  const { exportStory, isExporting, exportProgress, currentExport } = useExportStore();

  const handleExport = async (format: 'pdf' | 'epub') => {
    try {
      await exportStory(story.id, format);
      setOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
          <Download className="w-4 h-4" />
          <span>Export Story</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Export Story</Dialog.Title>
          
          <div className="space-y-4">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-gray-500" />
                <span>Export as PDF</span>
              </div>
              {isExporting && currentExport?.format === 'pdf' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => handleExport('epub')}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6 text-gray-500" />
                <span>Export as EPUB</span>
              </div>
              {isExporting && currentExport?.format === 'epub' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>
          </div>

          {isExporting && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Exporting...</span>
                <span className="text-sm text-gray-600">{exportProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>

      <Toast.Provider>
        <Toast.Root
          className="bg-white rounded-lg shadow-lg p-4 flex items-start gap-4"
          open={isExporting && exportProgress === 100}
          onOpenChange={() => {}}
        >
          <Toast.Title className="font-semibold">Export Complete</Toast.Title>
          <Toast.Description>
            Your story has been exported successfully. The download will begin automatically.
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-96" />
      </Toast.Provider>
    </Dialog.Root>
  );
};