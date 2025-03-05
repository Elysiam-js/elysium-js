/**
 * Elysium Core Library
 * 
 * Provides core functionality for Elysium.js components
 */

import { useState as reactUseState, useEffect } from 'react';

/**
 * State management hook similar to React's useState
 */
export function useState<T>(initialState: T): [T, (newState: T) => void] {
  return reactUseState(initialState);
}

/**
 * Lifecycle hook that runs when the component is mounted
 */
export function onMount(callback: () => void | (() => void)): void {
  useEffect(callback, []);
}

/**
 * Lifecycle hook that runs when the component is updated
 */
export function onUpdate(callback: () => void | (() => void), deps: any[] = []): void {
  useEffect(callback, deps);
}

/**
 * Lifecycle hook that runs before the component is unmounted
 */
export function onUnmount(callback: () => void): void {
  useEffect(() => callback, []);
}

/**
 * Create a store for state management
 */
export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();
  
  const getState = () => state;
  
  const setState = (newState: T) => {
    state = newState;
    listeners.forEach(listener => listener(state));
  };
  
  const subscribe = (listener: (state: T) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  return { getState, setState, subscribe };
}

/**
 * Hook to use a store in a component
 */
export function useStore<T>(store: { getState: () => T, subscribe: (listener: (state: T) => void) => () => void }) {
  const [state, setState] = useState(store.getState());
  
  onMount(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  });
  
  return state;
}

/**
 * Create a derived store that depends on other stores
 */
export function derived<T, U>(
  stores: Array<{ getState: () => any, subscribe: (listener: (state: any) => void) => () => void }>,
  fn: (...values: any[]) => U
) {
  const derivedStore = createStore<U>(fn(...stores.map(store => store.getState())));
  
  stores.forEach((store, i) => {
    store.subscribe(() => {
      const values = stores.map(s => s.getState());
      derivedStore.setState(fn(...values));
    });
  });
  
  return derivedStore;
}

/**
 * Create a writable store with methods to update it
 */
export function writable<T>(initialValue: T) {
  const store = createStore(initialValue);
  
  return {
    ...store,
    update: (fn: (value: T) => T) => {
      store.setState(fn(store.getState()));
    }
  };
}

/**
 * Fetch data from an API
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Handle form submission with automatic serialization
 */
export function handleSubmit(
  form: HTMLFormElement,
  callback: (data: Record<string, any>) => void | Promise<void>
) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    await callback(data);
  });
}

/**
 * Initialize HTMX for a component
 */
export function initHtmx(element: HTMLElement) {
  // Check if HTMX is loaded
  if (typeof window !== 'undefined' && window.htmx) {
    window.htmx.process(element);
  }
}

/**
 * Create a reactive signal (similar to SolidJS)
 */
export function createSignal<T>(initialValue: T): [() => T, (value: T) => void] {
  const store = createStore(initialValue);
  return [store.getState, store.setState];
}

/**
 * Create a computed value that depends on signals
 */
export function createComputed<T>(fn: () => T, deps: Array<() => any>): () => T {
  const store = createStore(fn());
  
  deps.forEach(dep => {
    onUpdate(() => {
      store.setState(fn());
    }, [dep()]);
  });
  
  return store.getState;
}

/**
 * Create a memoized value
 */
export function createMemo<T>(fn: () => T, deps: any[] = []): () => T {
  const [value, setValue] = useState<T>(fn());
  
  onUpdate(() => {
    setValue(fn());
  }, deps);
  
  return () => value;
}

/**
 * Create an effect that runs when dependencies change
 */
export function createEffect(fn: () => void | (() => void), deps: any[] = []): void {
  onUpdate(fn, deps);
}

/**
 * Create a resource for async data fetching
 */
export function createResource<T, U>(
  source: () => U,
  fetcher: (source: U) => Promise<T>
): [() => T | undefined, { loading: boolean, error: Error | null }] {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  onUpdate(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetcher(source());
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [source()]);
  
  return [() => data, { loading, error }];
}

// Export all as default for easier importing
export default {
  useState,
  onMount,
  onUpdate,
  onUnmount,
  createStore,
  useStore,
  derived,
  writable,
  fetchData,
  handleSubmit,
  initHtmx,
  createSignal,
  createComputed,
  createMemo,
  createEffect,
  createResource
};
