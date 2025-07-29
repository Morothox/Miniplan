import { SchedulerService } from './scheduler';
import { AltarServer, Mass } from '../models/types';

describe('SchedulerService', () => {
  let servers: AltarServer[];
  let scheduler: SchedulerService;

  beforeEach(() => {
    // Test-Daten vorbereiten
    servers = [
      // Gruppenleiter
      { id: 'gl1', name: 'Gruppenleiter 1', isGroupLeader: true, hasServedEarlyMass: true },
      { id: 'gl2', name: 'Gruppenleiter 2', isGroupLeader: true, hasServedEarlyMass: true },
      { id: 'gl3', name: 'Gruppenleiter 3', isGroupLeader: true, hasServedEarlyMass: true },
      
      // Geschwisterpaar 1
      { id: 'sib1a', name: 'Geschwister 1A', isGroupLeader: false, siblingId: 'sib1b', hasServedEarlyMass: false },
      { id: 'sib1b', name: 'Geschwister 1B', isGroupLeader: false, siblingId: 'sib1a', hasServedEarlyMass: false },
      
      // Einzelne Ministranten
      { id: 'ms1', name: 'Ministrant 1', isGroupLeader: false, hasServedEarlyMass: true },
      { id: 'ms2', name: 'Ministrant 2', isGroupLeader: false, hasServedEarlyMass: false },
      { id: 'ms3', name: 'Ministrant 3', isGroupLeader: false, hasServedEarlyMass: true },
    ];

    scheduler = new SchedulerService(servers);
  });

  it('should create a valid schedule with required number of servers', () => {
    const mass: Mass = {
      time: '10:30',
      date: '2023-08-06',
      requiredServers: 6,
      requiredGroupLeaders: 2
    };

    const result = scheduler.createSchedule(mass);

    if ('code' in result) {
      fail('Schedule creation should not return an error');
      return;
    }

    expect(result.servers.length).toBe(mass.requiredServers);
    expect(result.servers.filter(s => s.isGroupLeader).length).toBe(mass.requiredGroupLeaders);
  });

  it('should keep siblings together in schedule', () => {
    const mass: Mass = {
      time: '10:30',
      date: '2023-08-06',
      requiredServers: 6,
      requiredGroupLeaders: 2
    };

    const result = scheduler.createSchedule(mass);

    if ('code' in result) {
      fail('Schedule creation should not return an error');
      return;
    }

    const sib1a = result.servers.find(s => s.id === 'sib1a');
    const sib1b = result.servers.find(s => s.id === 'sib1b');

    // Wenn ein Geschwisterkind eingeteilt ist, muss das andere auch eingeteilt sein
    if (sib1a) {
      expect(sib1b).toBeDefined();
    }
    if (sib1b) {
      expect(sib1a).toBeDefined();
    }
  });

  it('should return error when not enough group leaders available', () => {
    const mass: Mass = {
      time: '10:30',
      date: '2023-08-06',
      requiredServers: 6,
      requiredGroupLeaders: 4 // Mehr als verfügbar
    };

    const result = scheduler.createSchedule(mass);

    if (!('code' in result)) {
      fail('Should return error when not enough group leaders');
      return;
    }

    expect(result.code).toBe('INSUFFICIENT_GROUP_LEADERS');
  });

  it('should return error when not enough regular servers available', () => {
    // Erstelle eine Masse mit mehr benötigten Ministranten als verfügbar
    const mass: Mass = {
      time: '10:30',
      date: '2023-08-06',
      requiredServers: 10, // Mehr als verfügbar
      requiredGroupLeaders: 2
    };

    const result = scheduler.createSchedule(mass);

    if (!('code' in result)) {
      fail('Should return error when not enough servers');
      return;
    }

    expect(result.code).toBe('INSUFFICIENT_SERVERS');
  });
});