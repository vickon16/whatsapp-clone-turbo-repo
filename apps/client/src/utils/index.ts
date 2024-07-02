import { env } from "@/env";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistance } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
});

export const convertImageToFile = async (
  imageUrl: string,
  fileName: string,
) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};
