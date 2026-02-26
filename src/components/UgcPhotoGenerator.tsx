import { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ImageUploader from './ImageUploader';

export default function UgcPhotoGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const parts: any[] = [];
      if (selectedImage && mimeType) {
        parts.push({
          inlineData: {
            data: selectedImage,
            mimeType: mimeType,
          },
        });
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        setError('Failed to generate image. Please try a different prompt.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `ugc-photo-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Create UGC Photo</h2>
        <p className="text-zinc-500 mt-2">
          Upload a product image and describe the scene to generate stunning lifestyle photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Product Image (Optional)
            </label>
            <ImageUploader
              selectedImage={selectedImage}
              onImageSelected={(base64, mime) => {
                setSelectedImage(base64);
                setMimeType(mime);
              }}
              onClear={() => {
                setSelectedImage(null);
                setMimeType('');
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Scene Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A young woman holding this product in a sunny cafe, lifestyle photography, highly detailed, 4k..."
              className="w-full h-32 px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {(['1:1', '3:4', '4:3', '9:16', '16:9'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    aspectRatio === ratio
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                      : 'bg-zinc-50 text-zinc-600 border-2 border-transparent hover:bg-zinc-100'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate UGC Photo
              </>
            )}
          </button>
        </div>

        {/* Right Column: Result */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-medium text-zinc-700 mb-4">Result Preview</h3>
          
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center min-h-[400px]">
            {isGenerating ? (
              <div className="flex flex-col items-center text-zinc-400">
                <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
                <p className="font-medium animate-pulse text-zinc-500">Creating your photo...</p>
              </div>
            ) : resultImage ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={resultImage}
                alt="Generated UGC"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <ImageIcon size={48} className="mb-4 opacity-50" />
                <p className="font-medium">Your generated photo will appear here</p>
              </div>
            )}
          </div>

          {resultImage && !isGenerating && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
                className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download size={18} />
                Download High-Res
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
