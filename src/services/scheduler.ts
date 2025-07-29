import { AltarServer, Mass, Schedule, PlanningError } from '../models/types';

export class SchedulerService {
  private servers: AltarServer[] = [];
  private groupLeaders: AltarServer[] = [];

  constructor(servers: AltarServer[]) {
    this.servers = servers.filter(server => !server.isGroupLeader);
    this.groupLeaders = servers.filter(server => server.isGroupLeader);
  }

  private getAvailableServers(date: string, assignedServers: string[]): AltarServer[] {
    return this.servers.filter(server => {
      // Server ist noch nicht für diese Messe eingeteilt
      const isNotAssigned = !assignedServers.includes(server.id);
      
      // Wenn Server ein Geschwisterkind hat, prüfe ob es verfügbar ist
      if (server.siblingId) {
        const sibling = this.servers.find(s => s.id === server.siblingId);
        return isNotAssigned && sibling && !assignedServers.includes(sibling.id);
      }
      
      return isNotAssigned;
    });
  }

  private getAvailableGroupLeaders(date: string, assignedServers: string[]): AltarServer[] {
    return this.groupLeaders.filter(leader => !assignedServers.includes(leader.id));
  }

  private assignServer(server: AltarServer, assignedServers: string[]): void {
    assignedServers.push(server.id);
    
    // Wenn Server ein Geschwisterkind hat, füge es auch hinzu
    if (server.siblingId) {
      const sibling = this.servers.find(s => s.id === server.siblingId);
      if (sibling) {
        assignedServers.push(sibling.id);
      }
    }
  }

  public createSchedule(mass: Mass): Schedule | PlanningError {
    const assignedServers: string[] = [];
    const schedule: Schedule = {
      mass,
      servers: []
    };

    // Zuerst Gruppenleiter zuweisen
    const availableLeaders = this.getAvailableGroupLeaders(mass.date, assignedServers);
    if (availableLeaders.length < mass.requiredGroupLeaders) {
      return {
        code: 'INSUFFICIENT_GROUP_LEADERS',
        message: `Nicht genügend Gruppenleiter verfügbar für ${mass.date} ${mass.time}`,
        date: mass.date
      };
    }

    // Gruppenleiter zuweisen
    for (let i = 0; i < mass.requiredGroupLeaders; i++) {
      const leader = availableLeaders[i];
      this.assignServer(leader, assignedServers);
      schedule.servers.push(leader);
    }

    // Reguläre Ministranten zuweisen
    const regularServersNeeded = mass.requiredServers - mass.requiredGroupLeaders;
    const availableServers = this.getAvailableServers(mass.date, assignedServers);

    if (availableServers.length < regularServersNeeded) {
      return {
        code: 'INSUFFICIENT_SERVERS',
        message: `Nicht genügend Ministranten verfügbar für ${mass.date} ${mass.time}`,
        date: mass.date
      };
    }

    // Versuche Geschwisterpaare zuerst zuzuweisen
    const siblingPairs = availableServers.filter(server => server.siblingId);
    for (const server of siblingPairs) {
      if (schedule.servers.length >= mass.requiredServers) break;
      
      const sibling = this.servers.find(s => s.id === server.siblingId);
      if (sibling && !assignedServers.includes(sibling.id)) {
        this.assignServer(server, assignedServers);
        schedule.servers.push(server);
        schedule.servers.push(sibling);
      }
    }

    // Fülle restliche Positionen mit einzelnen Ministranten
    while (schedule.servers.length < mass.requiredServers) {
      const availableServers = this.getAvailableServers(mass.date, assignedServers);
      if (availableServers.length === 0) break;
      
      const server = availableServers[0];
      this.assignServer(server, assignedServers);
      schedule.servers.push(server);
    }

    return schedule;
  }
}