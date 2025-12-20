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
import {
  ASSESSMENT_JUSTIFICATION_COPY,
  getSignalStrengthExplanation,
} from '../../shared/content/copy';
=======
import { SignalStrength } from '../../shared/models/assessment.model';
>>>>>>> Stashed changes

@Component({
  selector: 'app-assessment-justification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-justification.component.html',
  styleUrl: './assessment-justification.component.scss',
})
export class AssessmentJustificationComponent {
  @Input() aiCapabilities: string[] = [];
  @Input() aiLimitations: string[] = [];
  @Input() signalStrength: SignalStrength = 'moderate';
  @Output() continue = new EventEmitter<void>();

  readonly copy = ASSESSMENT_JUSTIFICATION_COPY;

  isSignalInfoExpanded = false;

  get signalStrengthExplanation(): string {
    return getSignalStrengthExplanation(this.signalStrength);
  }

  toggleSignalInfo(): void {
    this.isSignalInfoExpanded = !this.isSignalInfoExpanded;
  }

  onContinue(): void {
    this.continue.emit();
  }
}
