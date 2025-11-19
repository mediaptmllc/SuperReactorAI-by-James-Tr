import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, XCircle, AlertTriangle } from 'lucide-react';
import { VideoFile } from '../types';

interface UploadZoneProps {
  onFileSelected: (file: VideoFile) => void;
  onClear: () => void;
  currentFile: VideoFile | null;
  disabled: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, onClear, currentFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      processFile(file);
    }
  }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onFileSelected({ file, previewUrl: url });
  };

  if (currentFile) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in">
        <div className="relative bg-black border-2 border-red-900 rounded-xl overflow-hidden shadow-2xl">
            <video 
                src={currentFile.previewUrl} 
                controls 
                className="w-full max-h-[400px] object-contain bg-black"
            />
            <button 
                onClick={onClear}
                disabled={disabled}
                className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove video"
            >
                <XCircle className="w-6 h-6" />
            </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400 justify-center">
            <FileVideo className="w-4 h-4" />
            <span>{currentFile.file.name}</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">{(currentFile.file.size / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group
            ${isDragging 
                ? 'border-red-500 bg-red-900/20 scale-[1.02]' 
                : 'border-gray-700 bg-gray-900/50 hover:border-red-500/50 hover:bg-gray-900'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
          <p className="mb-2 text-xl text-gray-300 font-bold brand-font tracking-wide">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">MP4, WebM or Ogg (Max 200MB or 5mins)</p>
        </div>
        <input 
            type="file" 
            className="hidden" 
            accept="video/*"
            onChange={handleFileInput}
            disabled={disabled}
        />
      </label>
      
      <div className="mt-4 flex items-start gap-3 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-yellow-200/80 text-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-500" />
        <p>
            For this app, Gemini analyzes the raw video frames. 
            Clips up to 5 mins work best for "Reaction" generation.
        </p>
      </div>
    </div>
  );
};

export default UploadZone;