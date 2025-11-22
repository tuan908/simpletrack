import { ContactStatus } from "../domain/Contact";

export const statusOptions = [
  { value: ContactStatus.New, label: "New" },
  { value: ContactStatus.Talking, label: "Talking" },
  { value: ContactStatus.Won, label: "Won" },
  { value: ContactStatus.Lost, label: "Lost" },
] as const;
