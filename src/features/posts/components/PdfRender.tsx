'use client';

import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export interface PDFRenderProps {
    pdfUrl: string | Uint8Array;
    className?: string;
}

export const PDFRender = ({ pdfUrl, className = 'h-[320px]' }: PDFRenderProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    if (!pdfUrl) return null;
    const cleanUrl = typeof pdfUrl === 'string' ? pdfUrl.split('#')[0] : pdfUrl;

    if (!isMounted) {
        return (
            <div className={`w-full flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-500 ${className}`}>
                Loading PDF Viewer...
            </div>
        );
    }

    return (
        <div className={`w-full overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-inner ${className}`}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={cleanUrl} />
            </Worker>
        </div>
    );
};