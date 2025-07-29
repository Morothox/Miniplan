# Produkt-Anforderungsdokument: Ministranten-Einsatzplanung

## Einführung/Überblick
Die Ministranten-Einsatzplanungssoftware ist eine spezialisierte Anwendung zur automatischen Planung von Ministrantendiensten für die sonntäglichen Gottesdienste. Die Software soll mit n8n integriert werden, um Abwesenheitsmeldungen zu verarbeiten und Einsatzpläne zu generieren.

## Ziele
1. Automatische und faire Verteilung der Ministrantendienste
2. Berücksichtigung von Verfügbarkeiten und speziellen Anforderungen
3. Integration mit n8n für E-Mail-Verarbeitung
4. Einhaltung aller Planungsregeln und Einschränkungen

## User Stories
- Als Administrator möchte ich monatliche Einsatzpläne erstellen, die alle Regeln und Anforderungen berücksichtigen
- Als Administrator möchte ich Abwesenheitsmeldungen der Ministranten automatisch verarbeiten
- Als Administrator möchte ich sicherstellen, dass Geschwister in der gleichen Messe eingeteilt werden

## Funktionale Anforderungen

### 1. Grundlegende Planungsanforderungen
- Das System muss drei Sonntagsmessen berücksichtigen (8:30, 10:30, 18:00 Uhr)
- Pro Messe müssen genau 6 Ministranten eingeteilt werden:
  - 2 Gruppenleiter
  - 4 normale Ministranten
- Geschwisterpaare (5 Paare vorhanden) müssen in der gleichen Messe eingeteilt werden
- Jeder Ministrant muss mindestens einmal um 8:30 Uhr eingeteilt werden

### 2. Verteilungsregeln
- Gleichmäßige Verteilung der Einsätze auf alle 50 Ministranten
- Ministranten dürfen nur einmal am selben Tag eingeteilt werden
- Aus dem Pool von 8 Gruppenleitern müssen pro Messe 2 eingeteilt werden

### 3. Abwesenheitsverwaltung
- Verarbeitung von Abwesenheitsmeldungen aus n8n
- Berücksichtigung der Abwesenheiten bei der Planerstellung

### 4. N8N-Integration
- Empfang von Abwesenheitsdaten aus n8n <mcreference link="https://docs.n8n.io/integrations/" index="3">3</mcreference>
- Rückgabe der generierten Einsatzpläne an n8n im kompatiblen Format <mcreference link="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/" index="4">4</mcreference>

## Nicht-Ziele (Out of Scope)
- Keine Benutzeroberfläche für Ministranten oder Eltern
- Keine direkte E-Mail-Kommunikation (wird von n8n übernommen)
- Keine Verwaltung von Qualifikationen oder Ausbildungsständen
- Keine Verwaltung von Sondergottesdiensten

## Technische Anforderungen
- HTTP-Endpunkte für n8n-Integration <mcreference link="https://docs.n8n.io/api/" index="1">1</mcreference>
- JSON-basierte Datenkommunikation
- Robuste Fehlerbehandlung bei ungültigen Eingabedaten

## Erfolgsmetriken
- Erfolgreiche Erstellung von monatlichen Einsatzplänen
- Korrekte Einhaltung aller Planungsregeln
- Zuverlässige Verarbeitung von Abwesenheitsmeldungen

## Offene Fragen
1. Wie soll mit kurzfristigen Abwesenheitsmeldungen umgegangen werden?
2. Sollen bestimmte Feiertage oder besondere Gottesdienste anders behandelt werden?
3. Gibt es Präferenzen für bestimmte Messzeiten, die berücksichtigt werden sollen?