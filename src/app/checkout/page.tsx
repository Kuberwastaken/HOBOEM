"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Upload, X, Trash2, ArrowUpRight, MessageCircle, Download } from "lucide-react";
import { useCart } from "@/context/cart-context";
import {
    generateReceiptId,
    generateQRCode,
    generateCartUrl,
    captureReceiptAsPNG,
    generateReceiptPDF,
    downloadBlob,
    downloadDataURL,
    decodeCartData,
    CartQRItem,
} from "@/lib/receipt-generator";
import { useCurrency } from "@/context/currency-context";
import { PRODUCTS } from "@/lib/products";

export default function CheckoutPage() {
    const { items, updateQuantity, removeItem, clearCart, setItems } = useCart();
    const { formatPrice } = useCurrency();
    const receiptRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptId] = useState(() => generateReceiptId());
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [uploadMessage, setUploadMessage] = useState("Upload receipt to scan QR");

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

    // Generate QR when receipt shown
    useEffect(() => {
        if (showReceipt && items.length > 0) {
            const qrItems: CartQRItem[] = items.map((item, idx) => ({
                id: item.id,
                size: item.size,
                quantity: item.quantity,
                note: notes[`${item.id}-${item.size}-${idx}`] || ""
            }));
            generateQRCode(qrItems).then(setQrCodeUrl).catch(console.error);
        }
    }, [showReceipt, items, notes]);

    // Build WhatsApp message with link
    const buildWhatsAppUrl = () => {
        const qrItems: CartQRItem[] = items.map((item, idx) => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity,
            note: notes[`${item.id}-${item.size}-${idx}`] || ""
        }));
        const cartLink = generateCartUrl(qrItems);

        const message = `Hi! I'd like to enquire about my HOBOEM order

Receipt: ${receiptId}
Total: ${formatPrice(subtotal)}

Restore cart: ${cartLink}`;

        return `https://wa.me/917303681193?text=${encodeURIComponent(message)}`;
    };

    // File upload handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file?.type.startsWith("image/")) {
            showUploadError("Please upload an image");
            return;
        }

        setUploadStatus("processing");
        setUploadMessage("Scanning...");

        try {
            const img = await loadImage(file);
            const imageData = getImageData(img);
            const jsQR = (await import("jsqr")).default;
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (!code?.data) throw new Error("No QR");

            const url = new URL(code.data);
            const data = url.searchParams.get("data");
            if (!data) throw new Error("Invalid QR");

            const decoded = decodeCartData(data);
            const cartItems = decoded?.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id);
                return product ? { ...product, quantity: item.quantity, size: item.size } : null;
            }).filter(Boolean);

            if (!cartItems?.length) throw new Error("Not found");

            // Restore notes if present
            const newNotes: Record<string, string> = {};
            decoded?.forEach((item, idx) => {
                if (item.note) {
                    newNotes[`${item.id}-${item.size}-${idx}`] = item.note;
                }
            });
            setNotes(newNotes);

            setItems(cartItems as any);
            setUploadStatus("success");
            setUploadMessage(`${cartItems.length} items restored`);
        } catch {
            showUploadError("Scan failed");
        }

        setTimeout(() => { setUploadStatus("idle"); setUploadMessage("Upload receipt to scan QR"); }, 3000);
    };

    const showUploadError = (msg: string) => {
        setUploadStatus("error");
        setUploadMessage(msg);
        setTimeout(() => { setUploadStatus("idle"); setUploadMessage("Upload receipt to scan QR"); }, 3000);
    };

    const loadImage = (file: File): Promise<HTMLImageElement> =>
        new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(file);
        });

    const getImageData = (img: HTMLImageElement): ImageData => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const handleDownload = async (type: "pdf" | "png") => {
        if (!receiptRef.current) return;
        setIsGenerating(true);
        try {
            if (type === "pdf") {
                const blob = await generateReceiptPDF(receiptRef.current, receiptId);
                downloadBlob(blob, `HOBOEM-${receiptId}.pdf`);
            } else {
                const dataUrl = await captureReceiptAsPNG(receiptRef.current);
                downloadDataURL(dataUrl, `HOBOEM-${receiptId}.png`);
            }
        } catch (err) {
            console.error(`${type} failed:`, err);
        }
        setIsGenerating(false);
    };

    const getNote = (key: string) => notes[key] || "";
    const setNote = (key: string, val: string) => setNotes(prev => ({ ...prev, [key]: val }));

    const currentDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f5f5f0] text-black font-mono">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#f5f5f0]/95 backdrop-blur-sm border-b border-black/10">
                <div className="flex items-center justify-between px-4 md:px-8 h-14">
                    <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black">← Back</Link>
                    <h1 className="text-xs font-black tracking-[0.3em] uppercase">Manifest</h1>
                    <span className="text-sm font-black">{itemCount}</span>
                </div>
            </header>

            <div className="max-w-2xl mx-auto p-4 md:p-8">
                {/* Upload */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-4 border-2 border-dashed flex items-center gap-4 text-left transition-all ${uploadStatus === "success" ? "border-green-500 bg-green-50" :
                        uploadStatus === "error" ? "border-red-400 bg-red-50" :
                            uploadStatus === "processing" ? "border-black/40" :
                                "border-black/20 hover:border-black"
                        }`}
                >
                    <Upload className={`w-5 h-5 ${uploadStatus === "processing" ? "animate-pulse" : ""}`} />
                    <div>
                        <p className="text-xs font-bold uppercase">{uploadStatus === "idle" ? "Restore From Receipt" : uploadStatus === "processing" ? "Scanning..." : uploadStatus === "success" ? "Done!" : "Failed"}</p>
                        <p className="text-[10px] text-black/50">{uploadMessage}</p>
                    </div>
                </button>

                {/* Items */}
                <div className="mt-8">
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="text-2xl font-black uppercase">Items</h2>
                        {items.length > 0 && (
                            <button onClick={clearCart} className="text-[10px] uppercase text-black/40 hover:text-red-500 flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Clear
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="py-16 text-center border-2 border-dashed border-black/10">
                            <p className="text-sm uppercase text-black/40 mb-4">Empty</p>
                            <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase">
                                Browse <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, idx) => {
                                const key = `${item.id}-${item.size}-${idx}`;
                                return (
                                    <motion.div key={key} layout className="bg-white p-4 flex gap-4">
                                        <div className="relative w-16 h-16 bg-[#f5f5f0] flex-shrink-0">
                                            <Image src={item.variants[0]?.image || ''} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold uppercase truncate">{item.name}</h3>
                                                    <p className="text-[10px] text-black/40">{item.size || "One Size"}</p>
                                                </div>
                                                <p className="text-sm font-black">{formatPrice((item.price || 0) * item.quantity)}</p>
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <button onClick={() => updateQuantity(item.id, item.size, -1)} className="w-8 h-8 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white">−</button>
                                                <span className="w-8 h-8 flex items-center justify-center border-y border-black/20 text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.size, 1)} className="w-8 h-8 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white">+</button>
                                                <button onClick={() => removeItem(item.id, item.size)} className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-red-500"><X className="w-4 h-4" /></button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Note (optional)"
                                                value={getNote(key)}
                                                onChange={e => setNote(key, e.target.value)}
                                                className="w-full bg-transparent border-b border-black/10 text-xs py-2 mt-2 focus:outline-none focus:border-black placeholder:text-black/30"
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Summary & Generate */}
                {items.length > 0 && (
                    <div className="mt-8 bg-white p-6">
                        <div className="flex justify-between items-baseline mb-6">
                            <span className="text-[10px] uppercase text-black/40">Total ({itemCount})</span>
                            <span className="text-2xl font-black">{formatPrice(subtotal)}</span>
                        </div>
                        <button
                            onClick={() => setShowReceipt(true)}
                            className="w-full bg-black text-white h-12 text-sm font-bold uppercase tracking-widest hover:bg-black/90"
                        >
                            Generate Receipt
                        </button>
                    </div>
                )}

                {/* Receipt */}
                <AnimatePresence>
                    {showReceipt && items.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">

                            {/* RECEIPT - Redesigned, bigger text, Yeezy aesthetic */}
                            <div
                                ref={receiptRef}
                                className="bg-white border-4 border-black p-6 md:p-8"
                                style={{ fontFamily: "ui-monospace, monospace" }}
                            >
                                {/* Header */}
                                <div className="text-center border-b-4 border-black pb-6 mb-6">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em]">HOBOEM</h1>
                                    <p className="text-xs uppercase tracking-[0.4em] text-black/50 mt-2">Purchase Manifest</p>
                                </div>

                                {/* Meta */}
                                <div className="flex justify-between mb-6 pb-4 border-b border-dashed border-black/30">
                                    <div>
                                        <p className="text-[10px] uppercase text-black/40">Receipt</p>
                                        <p className="text-lg font-black">{receiptId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-black/40">Date</p>
                                        <p className="text-lg font-black">{currentDate}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {items.map((item, idx) => {
                                        const key = `${item.id}-${item.size}-${idx}`;
                                        const note = getNote(key);
                                        return (
                                            <div key={key} className="flex gap-4 items-start">
                                                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#f5f5f0] flex-shrink-0 border border-black/10">
                                                    <Image src={item.variants[0]?.image || ''} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="min-w-0">
                                                            <p className="text-base md:text-lg font-black uppercase truncate">{item.name}</p>
                                                            <p className="text-sm text-black/50">{item.size || "One Size"} × {item.quantity}</p>
                                                        </div>
                                                        <p className="text-lg md:text-xl font-black flex-shrink-0">{formatPrice((item.price || 0) * item.quantity)}</p>
                                                    </div>
                                                    {note && <p className="text-sm text-black/40 italic mt-1">"{note}"</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total */}
                                <div className="border-t-4 border-black pt-6">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg font-black uppercase">Total</span>
                                        <span className="text-3xl md:text-4xl font-black">{formatPrice(subtotal)}</span>
                                    </div>
                                    <p className="text-sm text-black/40 text-right">{itemCount} unit{itemCount !== 1 ? "s" : ""}</p>
                                </div>

                                {/* QR */}
                                <div className="mt-6 pt-6 border-t border-dashed border-black/30 flex justify-between items-end">
                                    {qrCodeUrl && (
                                        <div className="text-center">
                                            <img src={qrCodeUrl} alt="QR" className="w-20 h-20 md:w-24 md:h-24" />
                                            <p className="text-[10px] text-black/40 mt-2">Scan to restore</p>
                                        </div>
                                    )}
                                    <div className="text-right">
                                        <p className="text-lg font-black tracking-widest">HOBOEM.COM</p>
                                        <p className="text-sm text-black/40">Premium Fashion</p>
                                    </div>
                                </div>
                            </div>

                            {/* PRIMARY ACTION: WhatsApp with link */}
                            <a
                                href={buildWhatsAppUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 w-full h-14 bg-[#25D366] text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-95 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Send Enquiry on WhatsApp
                            </a>

                            <p className="text-center text-[10px] text-black/40 mt-3">
                                Opens WhatsApp with your order details + restore link
                            </p>

                            {/* Secondary: Download options */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <button
                                    onClick={() => handleDownload("png")}
                                    disabled={isGenerating}
                                    className="h-10 border-2 border-black text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white disabled:opacity-40"
                                >
                                    <Download className="w-3.5 h-3.5" /> PNG
                                </button>
                                <button
                                    onClick={() => handleDownload("pdf")}
                                    disabled={isGenerating}
                                    className="h-10 border-2 border-black text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white disabled:opacity-40"
                                >
                                    <Download className="w-3.5 h-3.5" /> PDF
                                </button>
                            </div>

                            {/* Contact */}
                            <div className="mt-6 p-4 bg-white text-center border border-black/10">
                                <p className="text-lg font-black">+91 73036 81193</p>
                                <p className="text-[10px] text-black/40 uppercase tracking-wider">WhatsApp Support</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
