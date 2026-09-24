import { useEffect, useState } from "react";
import { useBadgeStore } from "../store/badgeStore";

export interface ResponseData {
  type: "BADGE_UPDATE" | "NEW_ORDER";
  data: any;
}

export interface UseBadgeStreamReturn {
  isConnected: boolean;
  error: string | null;
}

export const useBadgeStream = (
  stationId: string | undefined,
  agentId: string | undefined,
  token?: string,
): UseBadgeStreamReturn => {
  const updateBadge = useBadgeStore((state) => state.updateBadge);
  const incrementBadge = useBadgeStore((state) => state.increment);

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId || !agentId) {
      console.log("No credentials");
      return;
    }
    console.log("connecting to SSE");
    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout>;
    console.log("connecting to stream");
    const connect = () => {
      const queryParams = new URLSearchParams({
        stationId,
        agentId,
        ...(token ? { token } : {}),
      });

      const url = `${import.meta.env.VITE_API_BASE_URL}/badges/stream?${queryParams.toString()}`;

      eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        // Ignore initial comment ping (":")
        if (!event.data || event.data === ":") {
          console.log("initial ping");
          return;
        }

        try {
          const payload = JSON.parse(event.data) as ResponseData;
          console.log(payload);
          if (payload.type === "BADGE_UPDATE") {
            updateBadge(payload.data);
          } else if (payload.type === "NEW_ORDER") {
            incrementBadge("order", payload.data?.value ?? 1);
          }
        } catch (err) {
          console.error("Failed to parse SSE payload:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        setIsConnected(false);
        setError("Connection lost. Retrying...");
        eventSource?.close();

        // Retry connection after 5 seconds if connection drops
        retryTimeout = setTimeout(() => {
          connect();
        }, 5000);
      };
    };

    connect();

    return () => {
      clearTimeout(retryTimeout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [stationId, agentId, token, updateBadge, incrementBadge]);

  return { isConnected, error };
};
