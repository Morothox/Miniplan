export interface AltarServer {
  id: string;
  name: string;
  isGroupLeader: boolean;
  siblingId?: string; // Optional: ID des Geschwisterkinds
  hasServedEarlyMass: boolean; // Hat bereits um 8:30 gedient
}

export interface Mass {
  time: '8:30' | '10:30' | '18:00';
  date: string; // ISO-Datumsformat
  requiredServers: number; // Normalerweise 6
  requiredGroupLeaders: number; // Normalerweise 2
}

export interface Absence {
  serverId: string;
  date: string; // ISO-Datumsformat
  reason?: string;
}

export interface Schedule {
  mass: Mass;
  servers: AltarServer[];
}

export interface MonthlyPlan {
  month: string; // Format: 'YYYY-MM'
  schedules: Schedule[];
}

export interface PlanningError {
  code: string;
  message: string;
  date?: string;
  serverId?: string;
}