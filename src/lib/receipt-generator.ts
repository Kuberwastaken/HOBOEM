import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface CartItemData {
    id: string;
    size?: string;
    quantity: number;
}

// Generate a unique receipt ID based on timestamp
export function generateReceiptId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.getTime().toString(36).toUpperCase().slice(-4);
    return `RCP-${dateStr}-${timeStr}`;
}

// Encode cart items into a compact base64 string
export function encodeCartData(items: CartItemData[]): string {
    const compact = items.map((item) => ({
        i: item.id,
        s: item.size || "",
        q: item.quantity,
    }));
    const json = JSON.stringify(compact);
    return btoa(json);
}

// Decode cart data from base64 string
export function decodeCartData(encoded: string): CartItemData[] | null {
    try {
        const json = atob(encoded);
        const compact = JSON.parse(json) as Array<{ i: string; s: string; q: number }>;
        return compact.map((item) => ({
            id: item.i,
            size: item.s || undefined,
            quantity: item.q,
        }));
    } catch {
        console.error("Failed to decode cart data");
        return null;
    }
}

// Generate QR code as data URL with encoded cart
export async function generateQRCode(cartData: CartItemData[], siteUrl: string = "https://hoboem.com"): Promise<string> {
    const encoded = encodeCartData(cartData);
    const url = `${siteUrl}/cart?data=${encoded}`;

    try {
        return await QRCode.toDataURL(url, {
            width: 120,
            margin: 1,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
    } catch (err) {
        console.error("QR Code generation failed:", err);
        throw err;
    }
}

// Capture receipt element as PNG data URL
export async function captureReceiptAsPNG(element: HTMLElement): Promise<string> {
    const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
    });
    return canvas.toDataURL("image/png");
}

// Generate PDF from receipt element
export async function generateReceiptPDF(element: HTMLElement, receiptId: string): Promise<Blob> {
    const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (receipt-like proportions)
    const pdfWidth = 80; // mm - receipt width
    const pdfHeight = (imgHeight / imgWidth) * pdfWidth;

    const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    return pdf.output("blob");
}

// Download blob as file
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Download data URL as file
export function downloadDataURL(dataUrl: string, filename: string): void {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Check if Web Share API is available (mobile)
export function canUseWebShare(): boolean {
    return typeof navigator !== "undefined" && !!navigator.share && !!navigator.canShare;
}

// Share receipt via Web Share API (mobile)
export async function shareReceipt(blob: Blob, receiptId: string): Promise<boolean> {
    const file = new File([blob], `HOBOEM-${receiptId}.pdf`, { type: "application/pdf" });

    if (!navigator.canShare?.({ files: [file] })) {
        return false;
    }

    try {
        await navigator.share({
            title: "HOBOEM Receipt",
            text: `My HOBOEM order receipt: ${receiptId}`,
            files: [file],
        });
        return true;
    } catch (err) {
        console.error("Share failed:", err);
        return false;
    }
}

// Format price in INR
export function formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
}
