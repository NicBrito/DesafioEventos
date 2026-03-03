import { useState, useMemo, useEffect } from 'react';
import { Event, EventFormData, EventStatus } from '@/core/types/event';
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

  const createEvent = async (eventData: EventFormData) => {
    const createdEvent = await EventService.createEvent(eventData);
    setEvents((currentEvents) => [createdEvent, ...currentEvents]);
    return createdEvent;
  };

  return { filteredEvents, loading, error, search, setSearch, statusFilter, setStatusFilter, createEvent };
}