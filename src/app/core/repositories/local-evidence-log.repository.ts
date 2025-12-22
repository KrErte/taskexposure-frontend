/*
 * Copyright 2025 TASKEXPOSURE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { EvidenceLogRepository } from './evidence-log.repository';
import {
  EvidenceEntry,
  EvidenceEntryCreate,
  EvidenceEntryUpdate,
} from '../../shared/models/evidence-entry.model';
import { generateUUID, getWeekKey } from '../../shared/utils/date.utils';

const STORAGE_KEY = 'taskexposure.evidenceLog.v1';

/**
 * Local storage implementation of Evidence Log repository
 */
@Injectable({
  providedIn: 'root',
})
export class LocalEvidenceLogRepository extends EvidenceLogRepository {
  private getStoredEntries(): EvidenceEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as EvidenceEntry[];
    } catch {
      console.error('Failed to parse evidence log data from localStorage');
      return [];
    }
  }

  private saveEntries(entries: EvidenceEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  getAll(from?: string, to?: string): Observable<EvidenceEntry[]> {
    let entries = this.getStoredEntries();

    // Sort by createdAt descending (most recent first)
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply date filters if provided
    if (from) {
      const fromDate = new Date(from);
      entries = entries.filter((e) => new Date(e.createdAt) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      entries = entries.filter((e) => new Date(e.createdAt) <= toDate);
    }

    return of(entries);
  }

  getById(id: string): Observable<EvidenceEntry | null> {
    const entries = this.getStoredEntries();
    const entry = entries.find((e) => e.id === id) || null;
    return of(entry);
  }

  create(data: EvidenceEntryCreate): Observable<EvidenceEntry> {
    const now = new Date().toISOString();
    const entry: EvidenceEntry = {
      id: generateUUID(),
      createdAt: now,
      title: data.title.trim(),
      notes: data.notes?.trim() || undefined,
      tags: data.tags?.map((t) => t.toLowerCase().trim()).filter((t) => t.length >= 2) || undefined,
      impact: data.impact || 'medium',
      source: data.source || 'manual',
      weekKey: getWeekKey(now),
    };

    const entries = this.getStoredEntries();
    entries.unshift(entry);
    this.saveEntries(entries);

    return of(entry);
  }

  update(id: string, data: EvidenceEntryUpdate): Observable<EvidenceEntry> {
    const entries = this.getStoredEntries();
    const index = entries.findIndex((e) => e.id === id);

    if (index === -1) {
      return throwError(() => new Error('Entry not found'));
    }

    const existing = entries[index];
    const updated: EvidenceEntry = {
      ...existing,
      updatedAt: new Date().toISOString(),
      title: data.title !== undefined ? data.title.trim() : existing.title,
      notes: data.notes !== undefined ? data.notes?.trim() || undefined : existing.notes,
      tags:
        data.tags !== undefined
          ? data.tags?.map((t) => t.toLowerCase().trim()).filter((t) => t.length >= 2) || undefined
          : existing.tags,
      impact: data.impact !== undefined ? data.impact : existing.impact,
    };

    entries[index] = updated;
    this.saveEntries(entries);

    return of(updated);
  }

  delete(id: string): Observable<void> {
    const entries = this.getStoredEntries();
    const filtered = entries.filter((e) => e.id !== id);

    if (filtered.length === entries.length) {
      return throwError(() => new Error('Entry not found'));
    }

    this.saveEntries(filtered);
    return of(void 0);
  }
}
