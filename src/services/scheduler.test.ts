import { SchedulerService } from './scheduler';
import { AltarServer, Mass, Absence } from '../models/types';

describe('SchedulerService', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const servers: AltarServer[] = [
    { id: 'leader1', name: 'Leader 1', isGroupLeader: true, hasServedEarlyMass: false },
    { id: 'leader2', name: 'Leader 2', isGroupLeader: true, hasServedEarlyMass: false },
    { id: 'server1', name: 'Server 1', isGroupLeader: false, hasServedEarlyMass: false },
    { id: 'server2', name: 'Server 2', isGroupLeader: false, hasServedEarlyMass: false },
    { id: 'server3', name: 'Server 3', isGroupLeader: false, hasServedEarlyMass: false, siblingId: 'server4' },
    { id: 'server4', name: 'Server 4', isGroupLeader: false, hasServedEarlyMass: false, siblingId: 'server3' },
    { id: 'server5', name: 'Server 5', isGroupLeader: false, hasServedEarlyMass: false },
    { id: 'server6', name: 'Server 6', isGroupLeader: false, hasServedEarlyMass: false }
  ];

  const mass: Mass = {
    date: tomorrowStr,
    time: '10:30',
    requiredServers: 6,
    requiredGroupLeaders: 2
  };

  test('erstellt einen gültigen Einsatzplan ohne Abwesenheiten', () => {
    const scheduler = new SchedulerService(servers);
    const schedule = scheduler.createSchedule(mass);

    expect('servers' in schedule).toBe(true);
    if ('servers' in schedule) {
      expect(schedule.servers.length).toBe(mass.requiredServers);
      const groupLeaders = schedule.servers.filter(s => s.isGroupLeader);
      expect(groupLeaders.length).toBe(mass.requiredGroupLeaders);
    }
  });

  test('berücksichtigt Abwesenheiten bei der Planung', () => {
    const absences: Absence[] = [
      { serverId: 'server1', date: tomorrowStr, reason: 'Urlaub' },
      { serverId: 'server2', date: tomorrowStr, reason: 'Krank' }
    ];

    const scheduler = new SchedulerService(servers, absences);
    const schedule = scheduler.createSchedule(mass);

    expect('servers' in schedule).toBe(true);
    if ('servers' in schedule) {
      expect(schedule.servers.length).toBe(mass.requiredServers);
      expect(schedule.servers.some(s => s.id === 'server1')).toBe(false);
      expect(schedule.servers.some(s => s.id === 'server2')).toBe(false);
    }
  });

  test('berücksichtigt Geschwister bei Abwesenheiten', () => {
    const absences: Absence[] = [
      { serverId: 'server3', date: tomorrowStr, reason: 'Urlaub' }
    ];

    const scheduler = new SchedulerService(servers, absences);
    const schedule = scheduler.createSchedule(mass);

    expect('servers' in schedule).toBe(true);
    if ('servers' in schedule) {
      // Wenn ein Geschwister abwesend ist, sollte das andere auch nicht eingeteilt werden
      expect(schedule.servers.some(s => s.id === 'server3')).toBe(false);
      expect(schedule.servers.some(s => s.id === 'server4')).toBe(false);
    }
  });

  test('gibt Fehler zurück bei zu vielen Abwesenheiten', () => {
    const absences: Absence[] = [
      { serverId: 'server1', date: tomorrowStr },
      { serverId: 'server2', date: tomorrowStr },
      { serverId: 'server3', date: tomorrowStr },
      { serverId: 'server4', date: tomorrowStr },
      { serverId: 'server5', date: tomorrowStr }
    ];

    const scheduler = new SchedulerService(servers, absences);
    const result = scheduler.createSchedule(mass);

    expect('code' in result).toBe(true);
    if ('code' in result) {
      expect(result.code).toBe('INSUFFICIENT_SERVERS');
    }
  });

  test('gibt Fehler zurück bei Abwesenheit von Gruppenleitern', () => {
    const absences: Absence[] = [
      { serverId: 'leader1', date: tomorrowStr },
      { serverId: 'leader2', date: tomorrowStr }
    ];

    const scheduler = new SchedulerService(servers, absences);
    const result = scheduler.createSchedule(mass);

    expect('code' in result).toBe(true);
    if ('code' in result) {
      expect(result.code).toBe('INSUFFICIENT_GROUP_LEADERS');
    }
  });
});