import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "MGA"): string {
  return new Intl.NumberFormat("mg-MG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace(currency, `${currency} `)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("mg-MG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
