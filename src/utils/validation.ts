import { Absence, AltarServer } from '../models/types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateAbsence(absence: Absence, server?: AltarServer): void {
  // Überprüfe, ob die Server-ID vorhanden ist
  if (!absence.serverId) {
    throw new ValidationError('Server-ID ist erforderlich');
  }

  // Überprüfe das Datumsformat (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(absence.date)) {
    throw new ValidationError('Ungültiges Datumsformat. Verwende YYYY-MM-DD');
  }

  // Überprüfe, ob das Datum in der Zukunft liegt
  const absenceDate = new Date(absence.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (absenceDate < today) {
    throw new ValidationError('Abwesenheitsmeldungen können nur für zukünftige Termine erstellt werden');
  }

  // Optional: Überprüfe, ob der angegebene Server existiert
  if (server && server.id !== absence.serverId) {
    throw new ValidationError('Die Server-ID stimmt nicht mit dem angegebenen Server überein');
  }
}

export function validateAbsenceList(absences: Absence[], servers: AltarServer[]): void {
  // Erstelle eine Map für schnellen Zugriff auf Server
  const serverMap = new Map(servers.map(server => [server.id, server]));

  for (const absence of absences) {
    // Überprüfe das Format jeder einzelnen Abwesenheit
    validateAbsence(absence);

    // Überprüfe, ob der Server existiert
    if (!serverMap.has(absence.serverId)) {
      throw new ValidationError(`Server mit ID ${absence.serverId} existiert nicht`);
    }

    // Überprüfe auf Duplikate für das gleiche Datum
    const duplicates = absences.filter(
      a => a.serverId === absence.serverId && a.date === absence.date
    );
    if (duplicates.length > 1) {
      throw new ValidationError(
        `Mehrfache Abwesenheitsmeldungen für Server ${absence.serverId} am ${absence.date}`
      );
    }
  }
}