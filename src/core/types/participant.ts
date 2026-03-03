export interface Participant {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName?: string;
  checkInDone: boolean;
}

export interface TransferParticipantData {
  participantId: string;
  newEventId: string;
}