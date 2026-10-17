'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Check, FileText, Video as VideoIcon } from 'lucide-react';
import { ProgressiveImage } from '@/components/shared/ProgressiveImage';
import { toast } from 'sonner';

interface MediaUploaderProps {
  mediaUrl: string;
  onMediaChange: (url: string) => void;
  mediaLoadState: 'idle' | 'loading' | 'loaded' | 'error';
  onStateChange: (state: 'idle' | 'loading' | 'loaded' | 'error') => void;
}

const SAMPLE_PRESETS = [
  { label: '🚀 Launch Graphic', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { label: '☕ Creative Workspace', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' },
  { label: '📊 Analytics Chart', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
];

export function MediaUploader({
  mediaUrl,
  onMediaChange,
  mediaLoadState,
  onStateChange,
}: MediaUploaderProps) {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>(
    mediaUrl.startsWith('data:') || mediaUrl.startsWith('blob:') ? 'upload' : 'url'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleProcessFile = (file: File) => {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(file.name);

    if (!isVideo && !isImage) {
      toast.error('Please upload an image or video file.');
      return;
    }

    // 15MB limit check
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit.');
      return;
    }

    setUploadedFileName(file.name);
    setUploadedFileSize(formatFileSize(file.size));
    setUploadedFileType(isVideo ? 'video' : 'image');
    onStateChange('loading');

    try {
      // Create local object URL (Blob URL) for instant zero-copy preview.
      // Append #video fragment for videos so format detection reliably classifies it.
      const rawUrl = URL.createObjectURL(file);
      const objectUrl = isVideo ? `${rawUrl}#video` : rawUrl;

      onMediaChange(objectUrl);
      onStateChange('loaded');
      toast.success(`Attached ${file.name}`);
    } catch {
      onStateChange('error');
      toast.error('Failed to read local file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClear = () => {
    onMediaChange('');
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setUploadedFileType(null);
    onStateChange('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDataUrl = mediaUrl.startsWith('data:') || mediaUrl.startsWith('blob:');

  return (
    <div className="space-y-2.5">
      {/* Header with Mode Toggle & Requirement Label */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Media Attachment</span>
        </label>

        {/* Upload Mode Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeMode === 'upload'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeMode === 'url'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
        aria-label="Upload local media file"
      />

      {/* Mode 1: Drag & Drop Zone */}
      {activeMode === 'upload' && !mediaUrl && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-sm">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Click to browse or drag & drop media here
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                PNG, JPG, WebP, GIF or MP4 (Max 15MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Web URL Input */}
      {activeMode === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={mediaUrl.startsWith('data:') || mediaUrl.startsWith('blob:') ? '' : mediaUrl}
              onChange={(e) => {
                onMediaChange(e.target.value);
                setUploadedFileName(null);
                setUploadedFileSize(null);
              }}
              placeholder="https://images.unsplash.com/... or paste image link"
              className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
            />
            {mediaUrl && !mediaUrl.startsWith('data:') && !mediaUrl.startsWith('blob:') && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
                title="Remove media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sample Media Presets */}
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500">Or pick a verified sample asset:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onMediaChange(preset.url);
                    setUploadedFileName(null);
                    setUploadedFileSize(null);
                  }}
                  className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attached Media Card (Shown when mediaUrl exists) */}
      {mediaUrl && (
        <div className="flex items-center justify-between gap-3 p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
              <ProgressiveImage
                src={mediaUrl}
                alt="Thumbnail preview"
                debounceMs={0}
                compact
                isVideo={uploadedFileType === 'video'}
                onStateChange={onStateChange}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {mediaLoadState === 'loaded' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    {uploadedFileType === 'video'
                      ? 'Video Attached'
                      : isDataUrl
                      ? 'Local File Attached'
                      : 'Media Attached'}
                  </span>
                ) : mediaLoadState === 'error' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                    <X className="w-3.5 h-3.5" />
                    Failed to Load Media
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                    <span className="w-3 h-3 rounded-full border-2 border-zinc-600 border-t-indigo-400 animate-spin" />
                    Processing media…
                  </span>
                )}
              </div>

              {uploadedFileName ? (
                <p className="text-[11px] text-zinc-300 truncate flex items-center gap-1 mt-0.5">
                  {uploadedFileType === 'video' ? (
                    <VideoIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                  ) : (
                    <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                  )}
                  <span className="truncate">{uploadedFileName}</span>
                  {uploadedFileSize && (
                    <span className="text-zinc-500 shrink-0">({uploadedFileSize})</span>
                  )}
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500 truncate font-mono mt-0.5">
                  {isDataUrl ? 'Local file attachment' : mediaUrl}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isDataUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-[11px] font-medium border border-zinc-700 transition-colors"
              >
                Replace
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors"
              title="Remove media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
