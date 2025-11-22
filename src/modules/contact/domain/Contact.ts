export enum ContactStatus {
  New,
  Talking,
  Won,
  Lost,
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
}

export interface CreateContactPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: number;
}

export interface CreateContactResultSuccess {
  id: string;
}

export interface CreateContactResultFailure {
  error: string;
}
