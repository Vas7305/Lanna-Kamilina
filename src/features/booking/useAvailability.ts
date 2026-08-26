import { useEffect, useState } from 'react';
import type { DayAvailability, SpecialistSelection } from '@/types';
import { toIsoDate } from '@/lib/format';
import { availabilityApi } from './api';

export interface AvailabilityState {
  days: DayAvailability[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads a rolling window of availability.
 *
 * Requests are keyed by service + specialist + window, and a stale response is
 * discarded rather than rendered — switching specialists quickly must not make
 * the calendar flicker between two people's schedules.
 */
export function useAvailability(
  serviceId: string | null,
  specialist: SpecialistSelection,
  days = 14,
): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>({
    days: [],
    loading: Boolean(serviceId),
    error: null,
  });

  useEffect(() => {
    if (!serviceId) {
      setState({ days: [], loading: false, error: null });
      return;
    }

    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    availabilityApi
      .getAvailability({ serviceId, specialist, from: toIsoDate(new Date()), days })
      .then((result) => {
        if (active) setState({ days: result, loading: false, error: null });
      })
      .catch(() => {
        if (active) {
          setState({
            days: [],
            loading: false,
            error: 'Не удалось загрузить свободное время. Попробуйте обновить страницу.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [serviceId, specialist, days]);

  return state;
}
