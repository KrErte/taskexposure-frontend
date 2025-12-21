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
import { BehaviorSubject } from 'rxjs';

export interface SessionState {
  sessionId: string | null;
  analysisId: string | null;
  flowId: string | null;
  startedAt: Date | null;
}

const STORAGE_KEY = 'taskexposure_session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly stateSubject = new BehaviorSubject<SessionState>(this.loadFromStorage());

  readonly state$ = this.stateSubject.asObservable();

  get currentState(): SessionState {
    return this.stateSubject.value;
  }

  get sessionId(): string | null {
    return this.stateSubject.value.sessionId;
  }

  get analysisId(): string | null {
    return this.stateSubject.value.analysisId;
  }

  get flowId(): string | null {
    return this.stateSubject.value.flowId;
  }

  /**
   * Start a new session
   */
  startSession(sessionId?: string): void {
    const newState: SessionState = {
      sessionId: sessionId || this.generateSessionId(),
      analysisId: null,
      flowId: null,
      startedAt: new Date(),
    };
    this.updateState(newState);
  }

  /**
   * Set the analysis ID after /analyze call
   */
  setAnalysisId(analysisId: string): void {
    this.updateState({
      ...this.currentState,
      analysisId,
    });
  }

  /**
   * Set the flow ID for flow-based API calls
   */
  setFlowId(flowId: string): void {
    this.updateState({
      ...this.currentState,
      flowId,
    });
  }

  /**
   * Clear the session and start fresh
   */
  clearSession(): void {
    const newState: SessionState = {
      sessionId: null,
      analysisId: null,
      flowId: null,
      startedAt: null,
    };
    this.updateState(newState);
    this.removeFromStorage();
  }

  /**
   * Check if there's an active session
   */
  hasActiveSession(): boolean {
    return this.stateSubject.value.sessionId !== null;
  }

  private updateState(state: SessionState): void {
    this.stateSubject.next(state);
    this.saveToStorage(state);
  }

  private generateSessionId(): string {
    return `te_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private loadFromStorage(): SessionState {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
        };
      }
    } catch (e) {
      console.warn('Failed to load session from storage:', e);
    }
    return {
      sessionId: null,
      analysisId: null,
      flowId: null,
      startedAt: null,
    };
  }

  private saveToStorage(state: SessionState): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save session to storage:', e);
    }
  }

  private removeFromStorage(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove session from storage:', e);
    }
  }
}
