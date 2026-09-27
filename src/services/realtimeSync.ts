import { Product, Order, AnnouncementSettings } from '../types';

export type RealtimeSyncEventType =
  | 'INIT'
  | 'CATALOG_UPDATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_DELETED'
  | 'ORDER_STATUS_UPDATED'
  | 'ANNOUNCEMENT_UPDATED';

export interface RealtimeSyncEvent {
  type: RealtimeSyncEventType;
  version?: number;
  products?: Product[];
  product?: Product;
  productId?: string;
  order?: Order;
  announcement?: AnnouncementSettings;
  timestamp?: number;
}

type EventCallback = (event: RealtimeSyncEvent) => void;

class RealtimeSyncManager {
  private listeners: Set<EventCallback> = new Set();
  private ws: WebSocket | null = null;
  private sse: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private reconnectTimeout: any = null;
  private reconnectAttempts = 0;
  private isDestroyed = false;

  constructor() {
    this.initBroadcastChannel();
    this.connectWebSocket();
    this.connectSSE();
  }

  // Cross-Tab instant synchronization via BroadcastChannel API
  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('aaru_realtime_sync');
        this.broadcastChannel.onmessage = (messageEvent) => {
          if (messageEvent.data) {
            this.notifyListeners(messageEvent.data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization skipped:', err);
      }
    }
  }

  // Primary Real-Time Transport: WebSockets
  private connectWebSocket() {
    if (typeof window === 'undefined' || this.isDestroyed) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/catalog`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: RealtimeSyncEvent = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (err) {
          console.warn('[RealtimeSync] Could not parse WS message:', err);
        }
      };

      this.ws.onclose = () => {
        if (!this.isDestroyed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // Will close and trigger reconnect automatically
      };
    } catch (err) {
      console.warn('[RealtimeSync] WebSocket init error:', err);
      this.scheduleReconnect();
    }
  }

  // Secondary Resilient Transport: Server-Sent Events (SSE)
  private connectSSE() {
    if (typeof window === 'undefined' || this.isDestroyed) return;

    try {
      this.sse = new EventSource('/api/products/stream');

      this.sse.onmessage = (event) => {
        try {
          const data: RealtimeSyncEvent = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (err) {
          console.warn('[RealtimeSync] Could not parse SSE message:', err);
        }
      };

      this.sse.onerror = () => {
        // EventSource will auto-retry
      };
    } catch (err) {
      console.warn('[RealtimeSync] SSE init error:', err);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout || this.isDestroyed) return;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connectWebSocket();
    }, delay);
  }

  private notifyListeners(event: RealtimeSyncEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[RealtimeSync] Listener error:', err);
      }
    });
  }

  // Subscribe to real-time events
  public subscribe(callback: EventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Dispatch an optimistic event across local browser tabs
  public broadcastLocally(event: RealtimeSyncEvent) {
    this.notifyListeners(event);
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.sse) {
      this.sse.close();
      this.sse = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.listeners.clear();
  }
}

// Global Singleton Instance
export const realtimeSync = new RealtimeSyncManager();
