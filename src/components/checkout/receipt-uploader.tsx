"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { PRODUCTS } from "@/lib/products";
import { decodeCartData } from "@/lib/receipt-generator";

type UploadStatus = "idle" | "parsing" | "success" | "error";

export function ReceiptUploader() {
    const { setItems } = useCart();
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        if (!file.type.includes("pdf") && !file.type.includes("image")) {
            setStatus("error");
            setMessage("Please upload a PDF or image file");
            return;
        }

        setStatus("parsing");
        setMessage("Processing receipt...");

        try {
            // For now, we'll extract cart data from the filename or use OCR in future
            // The primary method is scanning the QR code which embeds the cart data

            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Try to extract encoded data from URL params in the file
            // This is a simplified approach - in production, you'd use PDF parsing or OCR
            const text = await file.text().catch(() => "");

            // Look for our encoded cart data pattern
            const dataMatch = text.match(/data=([A-Za-z0-9+/=]+)/);
            if (dataMatch) {
                const decoded = decodeCartData(dataMatch[1]);
                if (decoded) {
                    // Convert decoded data back to cart items
                    const cartItems = decoded.map((item) => {
                        const product = PRODUCTS.find((p) => p.id === item.id);
                        if (!product) return null;
                        return {
                            ...product,
                            quantity: item.quantity,
                            size: item.size,
                        };
                    }).filter(Boolean);

                    if (cartItems.length > 0) {
                        setItems(cartItems as any);
                        setStatus("success");
                        setMessage(`Restored ${cartItems.length} item(s) to cart`);
                        return;
                    }
                }
            }

            setStatus("error");
            setMessage("Could not extract cart data. Try scanning the QR code instead.");
        } catch {
            setStatus("error");
            setMessage("Failed to process file");
        }
    }, [setItems]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const resetStatus = () => {
        setStatus("idle");
        setMessage("");
    };

    return (
        <div className="w-full">
            <p className="text-[10px] font-bold mb-3 uppercase text-black/40 tracking-[0.2em]">
                Restore from Receipt
            </p>

            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`
                    relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }
                    ${status === "success" ? "border-green-500 bg-green-50" : ""}
                    ${status === "error" ? "border-red-500 bg-red-50" : ""}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {status === "idle" && (
                    <>
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Drop receipt PDF or image
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                            or click to browse
                        </p>
                    </>
                )}

                {status === "parsing" && (
                    <>
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-xs text-green-600 uppercase tracking-wide">
                            {message}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetStatus();
                            }}
                            className="mt-2 text-[10px] text-green-700 underline hover:no-underline"
                        >
                            Upload another
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-xs text-red-600 uppercase tracking-wide">
                            {message}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetStatus();
                            }}
                            className="mt-2 text-[10px] text-red-700 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </>
                )}
            </div>

            <p className="text-[9px] text-gray-400 mt-2 text-center">
                Tip: Scan the QR code on receipt for instant restore
            </p>
        </div>
    );
}
