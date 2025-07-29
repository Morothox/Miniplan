import { AltarServer, Mass, Absence, Schedule, MonthlyPlan, PlanningError } from './types';

describe('Type Definitions', () => {
  describe('AltarServer', () => {
    it('should create a valid altar server', () => {
      const server: AltarServer = {
        id: '1',
        name: 'Max Mustermann',
        isGroupLeader: false,
        hasServedEarlyMass: false
      };
      expect(server).toBeDefined();
      expect(server.id).toBe('1');
    });

    it('should create a valid altar server with sibling', () => {
      const server: AltarServer = {
        id: '2',
        name: 'Anna Mustermann',
        isGroupLeader: false,
        siblingId: '3',
        hasServedEarlyMass: true
      };
      expect(server.siblingId).toBe('3');
    });
  });

  describe('Mass', () => {
    it('should create a valid mass schedule', () => {
      const mass: Mass = {
        time: '8:30',
        date: '2023-08-01',
        requiredServers: 6,
        requiredGroupLeaders: 2
      };
      expect(mass.time).toBe('8:30');
      expect(mass.requiredServers).toBe(6);
    });
  });

  describe('Schedule', () => {
    it('should create a valid schedule', () => {
      const schedule: Schedule = {
        mass: {
          time: '10:30',
          date: '2023-08-01',
          requiredServers: 6,
          requiredGroupLeaders: 2
        },
        servers: [
          {
            id: '1',
            name: 'Max Mustermann',
            isGroupLeader: true,
            hasServedEarlyMass: true
          }
        ]
      };
      expect(schedule.mass.time).toBe('10:30');
      expect(schedule.servers.length).toBe(1);
    });
  });

  describe('MonthlyPlan', () => {
    it('should create a valid monthly plan', () => {
      const plan: MonthlyPlan = {
        month: '2023-08',
        schedules: []
      };
      expect(plan.month).toBe('2023-08');
      expect(Array.isArray(plan.schedules)).toBe(true);
    });
  });
});