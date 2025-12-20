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

@Component({
  selector: 'app-risk-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-score.component.html',
  styleUrl: './risk-score.component.scss',
})
export class RiskScoreComponent {
  @Input() score: number = 0;
  @Output() continue = new EventEmitter<void>();

  get scoreColorClass(): string {
    if (this.score <= 30) return 'risk-score__percentage--low';
    if (this.score <= 60) return 'risk-score__percentage--medium';
    return 'risk-score__percentage--high';
  }

  onContinue(): void {
    this.continue.emit();
  }
}
