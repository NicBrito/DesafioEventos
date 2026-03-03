import { useState, useMemo, useEffect } from 'react';
import { Event, EventStatus } from '@/core/types/event';
import { EventService } from '@/services/event.service';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');

  useEffect(() => {
    EventService.getEvents()
      .then(setEvents)
      .catch(() => setError('Falha ao carregar eventos.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
                            event.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  return { filteredEvents, loading, error, search, setSearch, statusFilter, setStatusFilter };
}