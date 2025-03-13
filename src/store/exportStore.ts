import create from 'zustand';
import { exportStory as apiExportStory } from '../services/api';
import { toPdf } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface ExportState {
  isExporting: boolean;
  exportProgress: number;
  currentExport: {
    storyId: string;
    format: 'pdf' | 'epub';
  } | null;
  error: string | null;
  exportStory: (storyId: string, format: 'pdf' | 'epub') => Promise<void>;
}

export const useExportStore = create<ExportState>((set) => ({
  isExporting: false,
  exportProgress: 0,
  currentExport: null,
  error: null,

  exportStory: async (storyId: string, format: 'pdf' | 'epub') => {
    try {
      set({
        isExporting: true,
        exportProgress: 0,
        currentExport: { storyId, format },
        error: null,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        set((state) => ({
          exportProgress: Math.min(state.exportProgress + 10, 90),
        }));
      }, 500);

      const result = await apiExportStory(storyId, format);

      clearInterval(progressInterval);
      set({ exportProgress: 100 });

      // Trigger download
      const link = document.createElement('a');
      link.href = result.download_url;
      link.download = `story-${storyId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        set({
          isExporting: false,
          exportProgress: 0,
          currentExport: null,
        });
      }, 2000);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Export failed',
        isExporting: false,
      });
    }
  },
}));