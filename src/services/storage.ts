import { EventPlan, AppSettings, CurrencySymbol } from '../types';
import { SEED_EVENTS } from '../data/seedEvents';

const STORAGE_KEYS = {
  EVENTS: 'celebration_events_v1',
  ACTIVE_EVENT_ID: 'celebration_active_event_id_v1',
  SETTINGS: 'celebration_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  preferredCurrency: '$',
  theme: 'light',
  useAiSimulationFallback: true,
};

export const getStoredEvents = (): EventPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      saveStoredEvents(SEED_EVENTS);
      return SEED_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_EVENTS;
  } catch (e) {
    console.error('Failed to parse stored events', e);
    return SEED_EVENTS;
  }
};

export const saveStoredEvents = (events: EventPlan[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to localStorage', e);
  }
};

export const getActiveEventId = (events: EventPlan[]): string => {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT_ID);
    if (id && events.some(e => e.id === id)) {
      return id;
    }
  } catch (e) {
    console.error('Failed to read active event id', e);
  }
  return events[0]?.id || SEED_EVENTS[0].id;
};

export const saveActiveEventId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
  } catch (e) {
    console.error('Failed to save active event id', e);
  }
};

export const getAppSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const resetToSeedData = (): EventPlan[] => {
  saveStoredEvents(SEED_EVENTS);
  saveActiveEventId(SEED_EVENTS[0].id);
  return SEED_EVENTS;
};
