import QRCode from "qrcode";

// Receipt ID generator
export function generateReceiptId(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

// Format price in INR
export function formatPrice(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
}

// Cart item type for QR encoding
export interface CartQRItem {
    id: string;
    size?: string;
    quantity: number;
    note?: string;
}

// Encode cart data to base64 (includes notes)
export function encodeCartData(items: CartQRItem[]): string {
    const data = items.map(item => ({
        i: item.id,
        s: item.size || "",
        q: item.quantity,
        n: item.note || ""
    }));
    return btoa(JSON.stringify(data));
}

// Decode cart data from base64
export function decodeCartData(encoded: string): CartQRItem[] | null {
    try {
        const data = JSON.parse(atob(encoded));
        return data.map((item: { i: string; s: string; q: number; n?: string }) => ({
            id: item.i,
            size: item.s || undefined,
            quantity: item.q,
            note: item.n || ""
        }));
    } catch {
        return null;
    }
}

// Generate QR code data URL - now includes notes!
export async function generateQRCode(items: CartQRItem[]): Promise<string> {
    const encoded = encodeCartData(items);
    const url = `https://hoboem.com/cart?data=${encoded}`;
    return QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" }
    });
}

// Generate cart restore URL (for WhatsApp sharing)
export function generateCartUrl(items: CartQRItem[]): string {
    const encoded = encodeCartData(items);
    return `https://hoboem.com/cart?data=${encoded}`;
}

// Check if Web Share API is available
export function canUseWebShare(): boolean {
    return typeof navigator !== "undefined" && !!navigator.share && !!navigator.canShare;
}

// Share receipt via Web Share API
export async function shareReceipt(blob: Blob, receiptId: string): Promise<boolean> {
    if (!canUseWebShare()) return false;

    try {
        const file = new File([blob], `HOBOEM-${receiptId}.pdf`, { type: "application/pdf" });
        if (!navigator.canShare({ files: [file] })) return false;

        await navigator.share({
            files: [file],
            title: `HOBOEM Receipt ${receiptId}`,
            text: `HOBOEM Order ${receiptId}`
        });
        return true;
    } catch {
        return false;
    }
}

// Download blob as file
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download data URL as file
export function downloadDataURL(dataUrl: string, filename: string): void {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Capture element as PNG
export async function captureReceiptAsPNG(element: HTMLElement): Promise<string> {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false
    });
    return canvas.toDataURL("image/png");
}

// Generate PDF from element
export async function generateReceiptPDF(element: HTMLElement, receiptId: string): Promise<Blob> {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    return pdf.output("blob");
}
