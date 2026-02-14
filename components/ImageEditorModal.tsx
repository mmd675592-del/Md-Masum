
import React, { useState, useEffect } from 'react';
import { editImageWithGemini } from '../services/geminiService';

interface ImageEditorModalProps {
  file: File;
  onClose: () => void;
  onPost: (finalImage: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ file, onClose, onPost }) => {
  const [originalBase64, setOriginalBase64] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setOriginalBase64(b64);
      setPreviewUrl(b64);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const edited = await editImageWithGemini(originalBase64, prompt, file.type);
      if (edited) {
        setPreviewUrl(edited);
      } else {
        setError("Failed to generate image. Please try another prompt.");
      }
    } catch (err) {
      setError("An error occurred during image editing. Please check your connection or API key.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-green-50">
          <h3 className="font-bold text-green-800 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Gemini AI Studio
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-6 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <p className="text-gray-400">Loading image...</p>
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-green-700 font-semibold animate-pulse">Gemini is thinking...</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">How should Gemini edit this?</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Add a retro filter, remove background, add a llama next to me..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:outline-none min-h-[80px] text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={handleEdit}
                disabled={isProcessing || !prompt}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 disabled:bg-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-sparkles"></i>
                Generate Edit
              </button>
              <button 
                onClick={() => onPost(previewUrl)}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all active:scale-[0.98]"
              >
                Post Now
              </button>
            </div>
            
            <p className="text-[10px] text-center text-gray-400">
              Powered by Gemini 2.5 Flash Image. This is a real-time AI generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
