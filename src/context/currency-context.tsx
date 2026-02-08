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

const DEFAULT_RATES: Record<Currency, number> = {
    INR: 1,
    USD: 0.012,
    GBP: 0.0095,
    AED: 0.044,
    EUR: 0.011,
    JPY: 1.78,
    HKD: 0.094,
    CNY: 0.087,
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
    const [rates, setRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // 1. Fetch live rates
        const fetchRates = async () => {
            const urls = [
                "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.min.json",
                "https://latest.currency-api.pages.dev/v1/currencies/inr.min.json"
            ];

            for (const url of urls) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();

                    if (data && data.inr) {
                        const newRates: Partial<Record<Currency, number>> = {};
                        (Object.keys(DEFAULT_RATES) as Currency[]).forEach(curr => {
                            const lowercaseCurr = curr.toLowerCase();
                            if (data.inr[lowercaseCurr]) {
                                newRates[curr] = data.inr[lowercaseCurr];
                            }
                        });
                        setRates(prev => ({ ...prev, ...newRates }));
                        console.log(`Live exchange rates updated via ${url}`);
                        return; // Success, exit the loop
                    }
                } catch (error) {
                    console.error(`Failed to fetch from ${url}:`, error);
                }
            }
            console.log("Using default fallback rates due to API failures");
        };

        fetchRates();

        // 2. Detect location/currency
        const saved = localStorage.getItem("currency");
        if (saved && (saved in DEFAULT_RATES)) {
            setCurrency(saved as Currency);
        } else {
            const detectCurrency = async () => {
                try {
                    const response = await fetch("https://ipapi.co/json/");
                    const data = await response.json();
                    const country = data.country_code;

                    let detected: Currency = "USD";

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
        return price * rates[currency];
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
