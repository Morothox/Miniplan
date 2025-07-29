import { validateAbsence, validateAbsenceList, ValidationError } from './validation';
import { Absence, AltarServer } from '../models/types';

describe('validateAbsence', () => {
  const validAbsence: Absence = {
    serverId: 'server1',
    date: new Date().toISOString().split('T')[0], // Heutiges Datum
    reason: 'Urlaub'
  };

  const validServer: AltarServer = {
    id: 'server1',
    name: 'Test Server',
    isGroupLeader: false,
    hasServedEarlyMass: false
  };

  test('akzeptiert gültige Abwesenheitsmeldung', () => {
    expect(() => validateAbsence(validAbsence)).not.toThrow();
  });

  test('wirft Fehler bei fehlender Server-ID', () => {
    const invalidAbsence = { ...validAbsence, serverId: '' };
    expect(() => validateAbsence(invalidAbsence)).toThrow(ValidationError);
  });

  test('wirft Fehler bei ungültigem Datumsformat', () => {
    const invalidAbsence = { ...validAbsence, date: '2024.01.01' };
    expect(() => validateAbsence(invalidAbsence)).toThrow(ValidationError);
  });

  test('wirft Fehler bei Datum in der Vergangenheit', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const invalidAbsence = { 
      ...validAbsence, 
      date: pastDate.toISOString().split('T')[0]
    };
    expect(() => validateAbsence(invalidAbsence)).toThrow(ValidationError);
  });

  test('akzeptiert gültige Abwesenheit mit übereinstimmendem Server', () => {
    expect(() => validateAbsence(validAbsence, validServer)).not.toThrow();
  });

  test('wirft Fehler bei nicht übereinstimmender Server-ID', () => {
    const differentServer = { ...validServer, id: 'server2' };
    expect(() => validateAbsence(validAbsence, differentServer)).toThrow(ValidationError);
  });
});

describe('validateAbsenceList', () => {
  const servers: AltarServer[] = [
    {
      id: 'server1',
      name: 'Server 1',
      isGroupLeader: false,
      hasServedEarlyMass: false
    },
    {
      id: 'server2',
      name: 'Server 2',
      isGroupLeader: true,
      hasServedEarlyMass: false
    }
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  test('akzeptiert gültige Abwesenheitsliste', () => {
    const validAbsences: Absence[] = [
      { serverId: 'server1', date: tomorrowStr, reason: 'Urlaub' },
      { serverId: 'server2', date: tomorrowStr, reason: 'Krank' }
    ];
    expect(() => validateAbsenceList(validAbsences, servers)).not.toThrow();
  });

  test('wirft Fehler bei nicht existierendem Server', () => {
    const invalidAbsences: Absence[] = [
      { serverId: 'server3', date: tomorrowStr, reason: 'Urlaub' }
    ];
    expect(() => validateAbsenceList(invalidAbsences, servers)).toThrow(ValidationError);
  });

  test('wirft Fehler bei Duplikaten', () => {
    const duplicateAbsences: Absence[] = [
      { serverId: 'server1', date: tomorrowStr, reason: 'Urlaub' },
      { serverId: 'server1', date: tomorrowStr, reason: 'Krank' }
    ];
    expect(() => validateAbsenceList(duplicateAbsences, servers)).toThrow(ValidationError);
  });

  test('validiert jede einzelne Abwesenheit', () => {
    const invalidAbsences: Absence[] = [
      { serverId: 'server1', date: 'ungültiges-datum', reason: 'Urlaub' }
    ];
    expect(() => validateAbsenceList(invalidAbsences, servers)).toThrow(ValidationError);
  });
});