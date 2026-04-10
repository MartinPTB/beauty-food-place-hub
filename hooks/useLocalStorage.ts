"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw));
      }
    } catch (error) {
      console.error(`讀取 ${key} 失敗`, error);
    } finally {
      setIsReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`寫入 ${key} 失敗`, error);
    }
  }, [key, value, isReady]);

  return [value, setValue, isReady] as const;
}