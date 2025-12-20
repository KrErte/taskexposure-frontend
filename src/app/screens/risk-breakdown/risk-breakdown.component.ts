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
<<<<<<< Updated upstream
import { Task } from '../../app.component';
import { RISK_BREAKDOWN_COPY } from '../../shared/content/copy';
=======
import { Task } from '../../shared/models/task.model';
>>>>>>> Stashed changes

@Component({
  selector: 'app-risk-breakdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-breakdown.component.html',
  styleUrl: './risk-breakdown.component.scss',
})
export class RiskBreakdownComponent {
  @Input() tasks: Task[] = [];
  @Output() continue = new EventEmitter<void>();

<<<<<<< Updated upstream
  readonly copy = RISK_BREAKDOWN_COPY;

  getExposureClass(exposure: string): string {
=======
  getExposureClass(exposure: Task['exposure']): string {
>>>>>>> Stashed changes
    return `risk-breakdown__task--${exposure}`;
  }

  getExposureLabelClass(exposure: Task['exposure']): string {
    return `risk-breakdown__exposure-label--${exposure}`;
  }

  getExposureLabel(exposure: 'high' | 'medium' | 'low'): string {
    return this.copy.exposureLabels[exposure];
  }

  onContinue(): void {
    this.continue.emit();
  }
}
