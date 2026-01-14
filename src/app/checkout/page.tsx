"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Upload, Plus, Minus, X, MessageCircle, Download, Trash2 } from "lucide-react";
import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";
import {
    generateReceiptId,
    generateQRCode,
    captureReceiptAsPNG,
    generateReceiptPDF,
    downloadBlob,
    downloadDataURL,
    canUseWebShare,
    shareReceipt,
    formatPrice,
    decodeCartData,
} from "@/lib/receipt-generator";
import { PRODUCTS } from "@/lib/products";

// Item Notes Storage
const useItemNotes = () => {
    const [notes, setNotes] = useState<Record<string, string>>({});

    const setNote = (itemKey: string, note: string) => {
        setNotes(prev => ({ ...prev, [itemKey]: note }));
    };

    const getNote = (itemKey: string) => notes[itemKey] || "";

    return { notes, setNote, getNote };
};

export default function CheckoutPage() {
    const { items, updateQuantity, removeItem, clearCart, setItems } = useCart();
    const router = useRouter();
    const receiptRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [receiptId] = useState(() => generateReceiptId());
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const { notes, setNote, getNote } = useItemNotes();
    const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [uploadMessage, setUploadMessage] = useState("");

    // Calculations - recalculated on every render to ensure fresh values
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

    // Check if mobile on mount
    useEffect(() => {
        setIsMobile(canUseWebShare());
    }, []);

    // Generate QR when receipt is shown or items change
    useEffect(() => {
        if (showReceipt && items.length > 0) {
            const cartData = items.map((item) => ({
                id: item.id,
                size: item.size,
                quantity: item.quantity,
            }));
            generateQRCode(cartData).then(setQrCodeUrl).catch(console.error);
        }
    }, [showReceipt, items]);

    const handleGenerateReceipt = () => {
        if (items.length === 0) return;
        setShowReceipt(true);
    };

    // Handle file upload for receipt restoration
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus("processing");
        setUploadMessage("Scanning receipt...");

        try {
            // For images, try to scan QR code
            if (file.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);

                await new Promise((resolve) => {
                    img.onload = resolve;
                });

                // Create canvas to read image data
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas not supported");

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Try to find QR code using jsQR (dynamically imported)
                const jsQR = (await import("jsqr")).default;
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && code.data) {
                    // Extract cart data from URL
                    const url = new URL(code.data);
                    const data = url.searchParams.get("data");

                    if (data) {
                        const decoded = decodeCartData(data);
                        if (decoded && decoded.length > 0) {
                            const cartItems = decoded.map((item) => {
                                const product = PRODUCTS.find((p) => p.id === item.id);
                                if (!product) return null;
                                return { ...product, quantity: item.quantity, size: item.size };
                            }).filter(Boolean);

                            if (cartItems.length > 0) {
                                setItems(cartItems as any);
                                setUploadStatus("success");
                                setUploadMessage(`Restored ${cartItems.length} item(s)!`);
                                setTimeout(() => setUploadStatus("idle"), 3000);
                                return;
                            }
                        }
                    }
                }

                throw new Error("No valid QR code found");
            } else {
                // For PDFs, show manual instruction
                setUploadStatus("error");
                setUploadMessage("Please upload a PNG/JPG image of the receipt");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus("error");
            setUploadMessage("Could not scan QR code. Try a clearer image.");
        }

        setTimeout(() => setUploadStatus("idle"), 3000);
    };

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        setIsGenerating(true);
        try {
            const blob = await generateReceiptPDF(receiptRef.current, receiptId);
            downloadBlob(blob, `HOBOEM-${receiptId}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPNG = async () => {
        if (!receiptRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await captureReceiptAsPNG(receiptRef.current);
            downloadDataURL(dataUrl, `HOBOEM-${receiptId}.png`);
        } catch (err) {
            console.error("PNG generation failed:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!receiptRef.current) return;
        setIsGenerating(true);

        try {
            if (isMobile) {
                const blob = await generateReceiptPDF(receiptRef.current, receiptId);
                const shared = await shareReceipt(blob, receiptId);
                if (!shared) openWhatsAppLink();
            } else {
                openWhatsAppLink();
            }
        } catch {
            openWhatsAppLink();
        } finally {
            setIsGenerating(false);
        }
    };

    const openWhatsAppLink = () => {
        const phone = "917303681193";
        const message = encodeURIComponent(
            `Hi! Here's my HOBOEM order manifest (${receiptId}).\n\nTotal: ${formatPrice(subtotal)}\nUnits: ${itemCount}\n\nPlease find the receipt attached.`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    };

    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    }).toUpperCase();

    const fullDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-white text-black font-mono"
        >
            {/* Header */}
            <div className="border-b border-black">
                <div className="flex items-center justify-between px-4 md:px-8 h-14">
                    <button
                        onClick={() => router.back()}
                        className="text-xs hover:opacity-60 transition-opacity"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    <h1 className="text-sm md:text-base font-bold tracking-[0.3em]">MANIFEST</h1>

                    <div className="flex items-center gap-1.5 text-xs font-bold">
                        <BagIcon className="w-4 h-4" />
                        <span>[{itemCount}]</span>
                    </div>
                </div>
            </div>

            {/* Main Content - 3:4 aspect ratio container */}
            <div className="max-w-lg mx-auto px-4 md:px-6 py-6">
                {/* Restore Section */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed p-4 mb-6 cursor-pointer transition-all group ${uploadStatus === "success" ? "border-green-500 bg-green-50" :
                            uploadStatus === "error" ? "border-red-500 bg-red-50" :
                                uploadStatus === "processing" ? "border-blue-500 bg-blue-50" :
                                    "border-gray-300 hover:border-black hover:bg-gray-50"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <div className="flex items-center gap-3">
                        <Upload className={`w-5 h-5 transition-colors ${uploadStatus === "success" ? "text-green-600" :
                                uploadStatus === "error" ? "text-red-600" :
                                    uploadStatus === "processing" ? "text-blue-600 animate-pulse" :
                                        "text-gray-400 group-hover:text-black"
                            }`} />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide">
                                {uploadStatus === "idle" ? "Restore from Receipt" :
                                    uploadStatus === "processing" ? "Scanning..." :
                                        uploadStatus === "success" ? "Success!" :
                                            "Error"}
                            </p>
                            <p className={`text-[10px] ${uploadStatus === "success" ? "text-green-600" :
                                    uploadStatus === "error" ? "text-red-600" :
                                        uploadStatus === "processing" ? "text-blue-600" :
                                            "text-gray-500"
                                }`}>
                                {uploadStatus === "idle"
                                    ? "Upload PNG/JPG image of receipt to scan QR"
                                    : uploadMessage}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-black mb-5" />

                {/* Items Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Items</h2>
                        <span className="text-xs text-gray-500">[{itemCount}]</span>
                    </div>

                    {items.length === 0 ? (
                        <div className="border border-dashed border-gray-300 p-8 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-widest">No items in manifest</p>
                            <button
                                onClick={() => router.push("/")}
                                className="mt-4 text-xs underline hover:no-underline"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {items.map((item, idx) => {
                                const itemKey = `${item.id}-${item.size}-${idx}`;
                                const itemTotal = (item.price || 0) * item.quantity;
                                return (
                                    <div key={itemKey} className="border-t border-gray-200 py-3">
                                        <div className="flex gap-3">
                                            {/* Image */}
                                            <div className="relative w-14 h-14 bg-gray-50 flex-shrink-0">
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="56px"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold uppercase truncate">{item.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase">
                                                            Size: {item.size || "ONE SIZE"}
                                                        </p>
                                                    </div>

                                                    {/* Price - updates with quantity */}
                                                    <p className="text-sm font-bold flex-shrink-0">
                                                        {item.price ? formatPrice(itemTotal) : "—"}
                                                    </p>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.size, -1)}
                                                            className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors text-xs"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.size, 1)}
                                                            className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors text-xs"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => removeItem(item.id, item.size)}
                                                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-1"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {item.price && (
                                                        <p className="text-[10px] text-gray-400">
                                                            {formatPrice(item.price)} × {item.quantity}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Notes Input */}
                                                <input
                                                    type="text"
                                                    placeholder="Notes: (optional)"
                                                    value={getNote(itemKey)}
                                                    onChange={(e) => setNote(itemKey, e.target.value)}
                                                    className="w-full border border-gray-200 px-2 py-1.5 text-[10px] placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Totals */}
                            <div className="border-t border-gray-200 pt-3 mt-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500 uppercase">Total ({itemCount} units)</span>
                                    <span className="text-lg font-black">{formatPrice(subtotal)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-black mb-5" />

                {/* Actions */}
                <div className="mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateReceipt}
                            disabled={items.length === 0}
                            className="flex-1 bg-black text-white h-10 text-xs font-bold uppercase tracking-widest hover:bg-black/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Generate Receipt
                        </button>
                        <button
                            onClick={() => clearCart()}
                            disabled={items.length === 0}
                            className="h-10 px-3 border border-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Generated Receipt */}
                <AnimatePresence>
                    {showReceipt && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8"
                        >
                            <div className="border-t border-black mb-5" />

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Receipt Ready</h2>
                                <span className="text-xs text-gray-500">{currentDate}</span>
                            </div>

                            {/* Receipt Card - 3:4 aspect ratio with inline styles for html2canvas compatibility */}
                            <div
                                ref={receiptRef}
                                style={{
                                    aspectRatio: "3/4",
                                    backgroundColor: "#ffffff",
                                    border: "2px solid #000000",
                                    fontFamily: "ui-monospace, monospace",
                                    color: "#000000",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Decorative top border */}
                                <div style={{ height: "8px", backgroundColor: "#000000" }} />

                                <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
                                    {/* Receipt Header - Themed */}
                                    <div style={{ textAlign: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "2px solid #000000" }}>
                                        <div style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "0.4em" }}>HOBOEM</div>
                                        <div style={{ height: "2px", width: "64px", backgroundColor: "#000000", margin: "8px auto" }} />
                                        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em", color: "#666666" }}>Purchase Manifest</p>
                                    </div>

                                    {/* Receipt Meta */}
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px dashed #999999" }}>
                                        <div>
                                            <p style={{ color: "#666666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Receipt No.</p>
                                            <p style={{ fontWeight: 700, fontSize: "12px" }}>{receiptId}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ color: "#666666", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</p>
                                            <p style={{ fontWeight: 700, fontSize: "12px" }}>{fullDate}</p>
                                        </div>
                                    </div>

                                    {/* Receipt Items with Images */}
                                    <div style={{ flex: 1, overflow: "hidden" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {items.map((item, idx) => {
                                                const itemKey = `${item.id}-${item.size}-${idx}`;
                                                const note = getNote(itemKey);
                                                const itemTotal = (item.price || 0) * item.quantity;
                                                return (
                                                    <div key={itemKey} style={{ display: "flex", gap: "12px" }}>
                                                        {/* Product Image */}
                                                        <div style={{
                                                            position: "relative",
                                                            width: "48px",
                                                            height: "48px",
                                                            backgroundColor: "#f5f5f5",
                                                            flexShrink: 0,
                                                            border: "1px solid #e5e5e5"
                                                        }}>
                                                            <Image
                                                                src={item.images[0]}
                                                                alt={item.name}
                                                                fill
                                                                style={{ objectFit: "contain", padding: "2px" }}
                                                                sizes="48px"
                                                            />
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                                <div style={{ minWidth: 0 }}>
                                                                    <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                                                                    <p style={{ fontSize: "9px", color: "#666666" }}>
                                                                        {item.size || "ONE SIZE"} × {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <span style={{ fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                                                                    {item.price ? formatPrice(itemTotal) : "—"}
                                                                </span>
                                                            </div>
                                                            {note && (
                                                                <p style={{ fontSize: "9px", color: "#666666", fontStyle: "italic", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                    » {note}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Receipt Totals */}
                                    <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "2px solid #000000" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                            <span style={{ fontSize: "10px", color: "#666666", textTransform: "uppercase" }}>Units</span>
                                            <span style={{ fontSize: "14px", fontWeight: 700 }}>{itemCount}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase" }}>Total</span>
                                            <span style={{ fontSize: "20px", fontWeight: 900 }}>{formatPrice(subtotal)}</span>
                                        </div>
                                    </div>

                                    {/* QR Code Footer */}
                                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #999999", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                                        {qrCodeUrl && (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="Cart QR Code"
                                                    style={{ width: "64px", height: "64px" }}
                                                />
                                                <p style={{ fontSize: "8px", color: "#666666", marginTop: "4px" }}>Scan to restore</p>
                                            </div>
                                        )}
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "0.2em" }}>HOBOEM.COM</p>
                                            <p style={{ fontSize: "9px", color: "#666666" }}>Premium Fashion</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Export Actions */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="h-10 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-3 h-3" />
                                    PDF
                                </button>
                                <button
                                    onClick={handleDownloadPNG}
                                    disabled={isGenerating}
                                    className="h-10 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-3 h-3" />
                                    PNG
                                </button>
                                <button
                                    onClick={handleShare}
                                    disabled={isGenerating}
                                    className="h-10 bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    <MessageCircle className="w-3 h-3" />
                                    Send
                                </button>
                            </div>

                            {/* WhatsApp Info */}
                            <div className="text-center mt-3 p-3 bg-gray-50 border border-gray-100">
                                <p className="text-sm font-bold">+91 73036 81193</p>
                                <p className="text-[10px] text-gray-500">
                                    {isMobile ? "Tap Send to share directly" : "Download receipt, then attach in chat"}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
