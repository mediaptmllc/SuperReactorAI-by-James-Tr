import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ScriptCard from './components/ScriptCard';
import LoadingState from './components/LoadingState';
import SyncedVideoPlayer from './components/SyncedVideoPlayer';
import Login from './components/Login';
import { analyzeVideo, fileToBase64 } from './services/geminiService';
import { VideoFile, AnalysisStatus, ReactionItem } from './types';
import { Play, RefreshCw, AlertOctagon, Download } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // App State
  const [currentFile, setCurrentFile] = useState<VideoFile | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [script, setScript] = useState<ReactionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Ref for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileSelected = (file: VideoFile) => {
    setCurrentFile(file);
    setError(null);
    setScript([]);
    setStatus(AnalysisStatus.IDLE);
  };

  const handleClear = () => {
    setCurrentFile(null);
    setScript([]);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  const handleDownload = () => {
    if (script.length === 0) return;

    const content = script.map((item) => 
      `(${item.timestamp}) [${item.emotion}] ${item.line}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reaction_script_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    if (!currentFile) return;

    try {
      setStatus(AnalysisStatus.UPLOADING);
      
      // Convert to Base64
      const base64Data = await fileToBase64(currentFile.file);
      
      setStatus(AnalysisStatus.ANALYZING);
      
      // Call Gemini API
      const result = await analyzeVideo(base64Data, currentFile.file.type);
      
      setScript(result);
      setStatus(AnalysisStatus.COMPLETED);
      
      // Scroll to results after a brief delay to ensure render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      console.error(err);
      setStatus(AnalysisStatus.ERROR);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while consulting the Ring General.");
    }
  };

  // Authentication Gate
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col pb-20">
      <Header />

      <main className="flex-grow px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Intro Text */}
          <div className="text-center mt-12 mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white brand-font mb-4 uppercase tracking-tight">
              Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Reaction Script</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-lg">
              Upload a wrestling clip. SuperReactor will watch it and tell you exactly how to react like a pro.
            </p>
          </div>

          {/* Upload or Player Section */}
          {status === AnalysisStatus.COMPLETED && currentFile ? (
            <SyncedVideoPlayer 
              videoUrl={currentFile.previewUrl} 
              script={script}
              onClear={handleClear}
            />
          ) : (
            <UploadZone 
              onFileSelected={handleFileSelected} 
              onClear={handleClear} 
              currentFile={currentFile}
              disabled={status === AnalysisStatus.UPLOADING || status === AnalysisStatus.ANALYZING}
            />
          )}

          {/* Action Buttons */}
          {currentFile && status === AnalysisStatus.IDLE && (
            <div className="flex justify-center mt-8 animate-fade-in-up">
              <button
                onClick={handleAnalyze}
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-full shadow-[0px_0px_20px_rgba(220,38,38,0.5)] hover:shadow-[0px_0px_30px_rgba(220,38,38,0.7)] transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Play className="w-6 h-6 fill-current" />
                <span>ANALYZE MATCH</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {(status === AnalysisStatus.UPLOADING || status === AnalysisStatus.ANALYZING) && (
            <LoadingState status={status} />
          )}

          {/* Error State */}
          {status === AnalysisStatus.ERROR && (
            <div className="mt-12 p-6 bg-red-900/20 border border-red-800 rounded-xl text-center">
              <div className="inline-flex p-3 bg-red-900/50 rounded-full mb-4">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">BOTCHED MANEUVER!</h3>
              <p className="text-red-300 mb-6">{error}</p>
              <button 
                onClick={() => setStatus(AnalysisStatus.IDLE)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Results Section */}
          {status === AnalysisStatus.COMPLETED && script.length > 0 && (
            <div ref={resultsRef} className="mt-16 animate-fade-in">
              <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <h3 className="text-3xl font-bold text-white brand-font tracking-wide">
                  THE SCRIPT
                </h3>
                <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-700/50 rounded-full text-xs font-mono uppercase tracking-wider">
                  Generated by SUPERREACTOR AI
                </span>
              </div>

              <div className="space-y-6">
                {script.map((item, index) => (
                  <ScriptCard key={index} item={item} index={index} />
                ))}
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-bold tracking-wide transition-all border border-gray-700 hover:border-red-500/50 hover:text-red-400 shadow-lg group"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  DOWNLOAD SCRIPT
                </button>

                <button 
                  onClick={handleClear}
                  className="text-gray-500 hover:text-white underline decoration-gray-700 hover:decoration-white transition-all text-sm mt-2"
                >
                  Analyze Another Video
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;