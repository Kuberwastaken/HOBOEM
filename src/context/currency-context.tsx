"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "INR" | "USD" | "GBP" | "AED" | "EUR" | "JPY" | "HKD" | "CNY";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (price: number) => string;
    convertPrice: (price: number) => number;
    symbol: string;
}

const RATES: Record<Currency, number> = {
    INR: 1,
    USD: 0.012,
    GBP: 0.0095,
    AED: 0.044,
    EUR: 0.011,
    JPY: 1.76,
    HKD: 0.093,
    CNY: 0.086,
};

const SYMBOLS: Record<Currency, string> = {
    INR: "₹",
    USD: "$",
    GBP: "£",
    AED: "AED ",
    EUR: "€",
    JPY: "¥",
    HKD: "HK$",
    CNY: "¥",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>("INR");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem("currency");
        if (saved && (saved in RATES)) {
            setCurrency(saved as Currency);
        } else {
            // No saved currency, try to detect
            const detectCurrency = async () => {
                try {
                    const response = await fetch("https://ipapi.co/json/");
                    const data = await response.json();
                    const country = data.country_code; // e.g., "US", "IN", "GB"

                    let detected: Currency = "USD"; // Default fallback for international

                    if (country === "IN") detected = "INR";
                    else if (country === "GB") detected = "GBP";
                    else if (country === "AE") detected = "AED";
                    else if (country === "JP") detected = "JPY";
                    else if (country === "HK") detected = "HKD";
                    else if (country === "CN") detected = "CNY";
                    else if (["AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"].includes(country)) {
                        detected = "EUR";
                    }

                    setCurrency(detected);
                } catch (error) {
                    console.error("Failed to detect currency", error);
                    // Fallback to INR if detection fails (native brand currency)
                    setCurrency("INR");
                }
            };
            detectCurrency();
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("currency", currency);
        }
    }, [currency, isClient]);

    const convertPrice = (price: number) => {
        return price * RATES[currency];
    };

    const formatPrice = (price: number) => {
        const converted = convertPrice(price);
        // Round to 2 decimals for most, 0 for JPY
        const decimals = currency === "JPY" ? 0 : 2;
        return `${SYMBOLS[currency]}${converted.toFixed(decimals)}`;
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                formatPrice,
                convertPrice,
                symbol: SYMBOLS[currency],
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
