import { Event, EventFormData, EventStatus } from '@/core/types/event';
import { EventService } from '@/services/event.service';
import { useEffect, useMemo, useState } from 'react';

type PeriodFilter = 'All' | '7d' | '30d' | '90d' | 'thisMonth';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('All');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventService.getEvents();
      setEvents(data);
    } catch {
      setError('Falha ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
                            event.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
      const eventDate = new Date(event.date);
      const now = new Date();

      let matchesPeriod = true;

      if (periodFilter === '7d') {
        const limit = new Date();
        limit.setDate(limit.getDate() + 7);
        matchesPeriod = eventDate >= now && eventDate <= limit;
      }

      if (periodFilter === '30d') {
        const limit = new Date();
        limit.setDate(limit.getDate() + 30);
        matchesPeriod = eventDate >= now && eventDate <= limit;
      }

      if (periodFilter === '90d') {
        const limit = new Date();
        limit.setDate(limit.getDate() + 90);
        matchesPeriod = eventDate >= now && eventDate <= limit;
      }

      if (periodFilter === 'thisMonth') {
        matchesPeriod =
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [events, search, statusFilter, periodFilter]);

  const createEvent = async (eventData: EventFormData) => {
    setError(null);
    try {
      const createdEvent = await EventService.createEvent(eventData);
      setEvents((currentEvents) => [createdEvent, ...currentEvents]);
      return createdEvent;
    } catch {
      setError('Não foi possível criar o evento.');
      throw new Error('create-event-failed');
    }
  };

  const updateEvent = async (id: string, eventData: EventFormData) => {
    setError(null);
    try {
      const updatedEvent = await EventService.updateEvent(id, eventData);
      setEvents((currentEvents) =>
        currentEvents.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
    } catch {
      setError('Não foi possível atualizar o evento.');
      throw new Error('update-event-failed');
    }
  };

  const deleteEvent = async (id: string) => {
    setError(null);
    try {
      await EventService.deleteEvent(id);
      setEvents((currentEvents) => currentEvents.filter((event) => event.id !== id));
    } catch {
      setError('Não foi possível remover o evento.');
      throw new Error('delete-event-failed');
    }
  };

  return {
    filteredEvents,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  };
}