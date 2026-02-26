import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export default function ImageUploader({ onImageSelected, selectedImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 and mime type
      const match = result.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        onImageSelected(match[2], match[1]);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 aspect-square flex items-center justify-center group">
        <img
          src={`data:image/jpeg;base64,${selectedImage}`}
          alt="Selected product"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClear}
            className="bg-white text-zinc-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-zinc-100 transition-colors shadow-sm"
          >
            <X size={16} />
            Remove Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all aspect-square flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-zinc-200 flex items-center justify-center text-zinc-500 mb-4">
        <Upload size={24} />
      </div>
      <h3 className="font-medium text-zinc-900 mb-1">Upload Product Image</h3>
      <p className="text-sm text-zinc-500 max-w-[200px]">
        Drag and drop your image here, or click to browse
      </p>
    </div>
  );
}
