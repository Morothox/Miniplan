import { SchedulerService } from './services/scheduler';
import { AltarServer, Mass, Absence } from './models/types';

// Testdaten: Ministranten
const servers: AltarServer[] = [
  { id: 'leader1', name: 'Anna', isGroupLeader: true, hasServedEarlyMass: false },
  { id: 'leader2', name: 'Ben', isGroupLeader: true, hasServedEarlyMass: false },
  { id: 'server1', name: 'Clara', isGroupLeader: false, hasServedEarlyMass: false },
  { id: 'server2', name: 'David', isGroupLeader: false, hasServedEarlyMass: false },
  { id: 'server3', name: 'Emma', isGroupLeader: false, hasServedEarlyMass: false, siblingId: 'server4' },
  { id: 'server4', name: 'Felix', isGroupLeader: false, hasServedEarlyMass: false, siblingId: 'server3' },
  { id: 'server5', name: 'Greta', isGroupLeader: false, hasServedEarlyMass: false },
  { id: 'server6', name: 'Henry', isGroupLeader: false, hasServedEarlyMass: false }
];

// Testmesse
// Zukünftiges Datum (3 Monate in der Zukunft)
const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 3);
const testDate = futureDate.toISOString().split('T')[0];

const mass: Mass = {
  date: testDate,
  time: '10:30',
  requiredServers: 6,
  requiredGroupLeaders: 2
};

// Abwesenheiten
const absences: Absence[] = [
  { serverId: 'server1', date: testDate, reason: 'Krank' },
  { serverId: 'server2', date: testDate, reason: 'Urlaub' }
];

// Erstelle den Scheduler und plane die Messe
const scheduler = new SchedulerService(servers, absences);
const result = scheduler.createSchedule(mass);

console.log('\nTestprogramm für Ministranten-Einsatzplanung\n');
console.log('Messe:', mass);
console.log('\nAbwesende Ministranten:');
absences.forEach(absence => {
  const server = servers.find(s => s.id === absence.serverId);
  console.log(`- ${server?.name}: ${absence.reason}`);
});

console.log('\nErgebnis:');
if ('code' in result) {
  console.log('Fehler:', result.message);
} else {
  console.log('Eingeteilte Ministranten:');
  result.servers.forEach(server => {
    const role = server.isGroupLeader ? 'Gruppenleiter' : 'Ministrant';
    console.log(`- ${server.name} (${role})`);
  });
}