/**
 * Elysium Core Library
 * 
 * Provides core functionality for Elysium.js components
 */

import React from 'react';
const { useState: reactUseState, useEffect } = React;

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
    const unsubscribe = store.subscribe(newState => {
      setState(newState);
    });
    
    return unsubscribe;
  });
  
  return state;
}

/**
 * Create a derived store that depends on other stores
 */
export function derived<U>(
  stores: Array<{ getState: () => any, subscribe: (listener: (state: any) => void) => () => void }>,
  fn: (...values: any[]) => U
) {
  const derivedStore = createStore<U>(fn(...stores.map(store => store.getState())));
  
  stores.forEach(store => {
    store.subscribe(() => {
      derivedStore.setState(fn(...stores.map(store => store.getState())));
    });
  });
  
  return {
    getState: derivedStore.getState,
    subscribe: derivedStore.subscribe,
  };
}

/**
 * Create a writable store with methods to update it
 */
export function writable<T>(initialValue: T) {
  const store = createStore<T>(initialValue);
  
  return {
    ...store,
    update: (fn: (value: T) => T) => {
      store.setState(fn(store.getState()));
    },
    set: store.setState,
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
  
  return response.json() as Promise<T>;
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
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
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
  } else {
    console.warn('HTMX is not loaded. Make sure to include it in your HTML.');
  }
}

/**
 * Create a reactive signal (similar to SolidJS)
 */
export function createSignal<T>(initialValue: T): [() => T, (value: T) => void] {
  const store = writable<T>(initialValue);
  return [store.getState, store.set];
}

/**
 * Create a computed value that depends on signals
 */
export function createComputed<T>(fn: () => T, deps: Array<() => any>): () => T {
  const signals = deps.map(dep => {
    const [get, set] = createSignal(dep());
    return { get, set };
  });
  
  const [get, set] = createSignal(fn());
  
  deps.forEach((dep, i) => {
    createEffect(() => {
      signals[i].set(dep());
      set(fn());
    });
  });
  
  return get;
}

/**
 * Create a memoized value
 */
export function createMemo<T>(fn: () => T, deps: any[] = []): () => T {
  let lastValue: T;
  let lastDeps: any[] = [];
  let initialized = false;
  
  return () => {
    const depsChanged = !initialized || deps.some((dep, i) => dep !== lastDeps[i]);
    
    if (depsChanged) {
      lastValue = fn();
      lastDeps = [...deps];
      initialized = true;
    }
    
    return lastValue;
  };
}

/**
 * Create an effect that runs when dependencies change
 */
export function createEffect(fn: () => void | (() => void), deps: any[] = []): void {
  useEffect(fn, deps);
}

/**
 * Create a resource for async data fetching
 */
export function createResource<T, U>(
  source: () => U,
  fetcher: (source: U) => Promise<T>
): [() => T | undefined, { loading: boolean, error: Error | null }] {
  const [data, setData] = createSignal<T | undefined>(undefined);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  
  createEffect(() => {
    const currentSource = source();
    
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetcher(currentSource);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [source]);
  
  return [
    data,
    {
      get loading() { return loading(); },
      get error() { return error(); }
    }
  ];
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
