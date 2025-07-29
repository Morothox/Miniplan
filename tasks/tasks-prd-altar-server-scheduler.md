## Relevante Dateien

- `src/models/types.ts` - Typdefinitionen für Ministranten, Gruppenleiter und Einsatzplan
- `src/models/types.test.ts` - Tests für Typdefinitionen
- `src/services/scheduler.ts` - Hauptlogik für die Einsatzplanung
- `src/services/scheduler.test.ts` - Tests für die Planungslogik
- `src/api/routes.ts` - API-Endpunkte für n8n-Integration
- `src/api/routes.test.ts` - Tests für API-Endpunkte
- `src/utils/validation.ts` - Validierungsfunktionen für Eingabedaten
- `src/utils/validation.test.ts` - Tests für Validierungsfunktionen

### Hinweise

- Die Tests sollten in der gleichen Verzeichnisstruktur wie der Produktionscode liegen
- Verwende `npm test` zum Ausführen der Tests
- Die API-Endpunkte müssen mit der n8n-HTTP-Request-Node kompatibel sein

## Aufgaben

- [x] 1.0 Grundlegende Projektstruktur aufsetzen
  - [x] 1.1 Projekt initialisieren und Abhängigkeiten installieren
  - [x] 1.2 Verzeichnisstruktur erstellen
  - [x] 1.3 TypeScript und Test-Framework konfigurieren
  - [x] 1.4 Basis-Typen und Interfaces definieren

- [ ] 2.0 Kernlogik für Einsatzplanung implementieren
  - [ ] 2.1 Algorithmus für faire Verteilung entwickeln
  - [ ] 2.2 Geschwister-Regel implementieren
  - [ ] 2.3 Gruppenleiter-Zuweisung implementieren
  - [ ] 2.4 8:30-Uhr-Regel implementieren
  - [ ] 2.5 Tests für Planungslogik schreiben

- [ ] 3.0 Abwesenheitsverwaltung entwickeln
  - [ ] 3.1 Datenstruktur für Abwesenheiten erstellen
  - [ ] 3.2 Validierung von Abwesenheitsmeldungen
  - [ ] 3.3 Integration in Planungsalgorithmus
  - [ ] 3.4 Tests für Abwesenheitsverwaltung

- [ ] 4.0 N8N-Integration implementieren
  - [ ] 4.1 API-Endpunkte für Abwesenheitsmeldungen erstellen
  - [ ] 4.2 API-Endpunkt für Plangenerierung erstellen
  - [ ] 4.3 Fehlerbehandlung implementieren
  - [ ] 4.4 Tests für API-Endpunkte

- [ ] 5.0 Dokumentation und Deployment
  - [ ] 5.1 API-Dokumentation erstellen
  - [ ] 5.2 Deployment-Anleitung schreiben
  - [ ] 5.3 n8n-Workflow-Beispiele dokumentieren