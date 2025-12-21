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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapAction } from '../../shared/models/roadmap-action.model';
import { ROADMAP_COPY } from '../../shared/content/copy';

interface ActionWithState extends RoadmapAction {
  completed: boolean;
  impactScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent {
  @Input() set actions(value: RoadmapAction[]) {
    this.actionsWithState = value.map((action, index) => ({
      ...action,
      completed: false,
      impactScore: this.calculateImpactScore(index),
      difficulty: this.calculateDifficulty(index),
    }));
  }
  @Output() continue = new EventEmitter<void>();

  readonly copy = ROADMAP_COPY;
  actionsWithState: ActionWithState[] = [];
  celebratingIndex: number | null = null;

  get completedCount(): number {
    return this.actionsWithState.filter((a) => a.completed).length;
  }

  get totalImpact(): number {
    return this.actionsWithState
      .filter((a) => a.completed)
      .reduce((sum, a) => sum + a.impactScore, 0);
  }

  get potentialImpact(): number {
    return this.actionsWithState.reduce((sum, a) => sum + a.impactScore, 0);
  }

  get progressPercentage(): number {
    if (this.actionsWithState.length === 0) return 0;
    return (this.completedCount / this.actionsWithState.length) * 100;
  }

  private calculateImpactScore(index: number): number {
    // First actions have higher impact
    return Math.max(5, 15 - index * 3);
  }

  private calculateDifficulty(index: number): 'easy' | 'medium' | 'hard' {
    if (index === 0) return 'easy';
    if (index < 3) return 'medium';
    return 'hard';
  }

  getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard'): string {
    return {
      easy: 'Quick win',
      medium: 'Moderate effort',
      hard: 'Long-term',
    }[difficulty];
  }

  toggleAction(index: number): void {
    const action = this.actionsWithState[index];
    action.completed = !action.completed;

    if (action.completed) {
      this.celebratingIndex = index;
      setTimeout(() => {
        this.celebratingIndex = null;
      }, 1500);
    }
  }

  onContinue(): void {
    this.continue.emit();
  }
}
