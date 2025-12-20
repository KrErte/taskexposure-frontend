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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './shared/layout/layout.component';

import { Task } from './shared/models/task.model';
import { AssessmentData } from './shared/models/assessment.model';

import { EntryComponent } from './screens/entry/entry.component';
import { InputMethodComponent } from './screens/input-method/input-method.component';
import { ManualInputComponent } from './screens/manual-input/manual-input.component';
import { ClarifyingQuestionsComponent } from './screens/clarifying-questions/clarifying-questions.component';
import { AssessmentJustificationComponent } from './screens/assessment-justification/assessment-justification.component';
import { RiskScoreComponent } from './screens/risk-score/risk-score.component';
import { RiskBreakdownComponent } from './screens/risk-breakdown/risk-breakdown.component';
import { RoadmapComponent } from './screens/roadmap/roadmap.component';
import { SummaryComponent } from './screens/summary/summary.component';

type ScreenId =
  | 'entry'
  | 'input-method'
  | 'manual-input'
  | 'clarifying-questions'
  | 'assessment-justification'
  | 'risk-score'
  | 'risk-breakdown'
  | 'roadmap'
  | 'summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,

    // Layout wrapper used in app.component.html
    LayoutComponent,

    // Screens used in app.component.html
    EntryComponent,
    InputMethodComponent,
    ManualInputComponent,
    ClarifyingQuestionsComponent,
    AssessmentJustificationComponent,
    RiskScoreComponent,
    RiskBreakdownComponent,
    RoadmapComponent,
    SummaryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // app.component.html uses this to switch sections
  currentScreen: ScreenId = 'entry';

  // app.component.html expects assessmentData.*
  assessmentData: AssessmentData = this.createInitialMockAssessment();

  navigateTo(screen: ScreenId): void {
    this.currentScreen = screen;
  }

  onTasksSubmitted(tasks: string[]): void {
    // Minimal v1 wiring: take user tasks if provided, otherwise keep mock defaults.
    if (tasks?.length) {
      // we keep the same risk mock but swap descriptions to what user typed
      const newTasks = this.generateMockTaskAnalysis(tasks);
      this.assessmentData = { ...this.assessmentData, tasks: newTasks };
    }
    this.navigateTo('clarifying-questions');
  }

  onClarifyingComplete(_answers: unknown): void {
    // v1: after clarifying, show justification BEFORE score
    this.navigateTo('assessment-justification');
  }

  onShowScore(): void {
    this.navigateTo('risk-score');
  }

  onContinueFromScore(): void {
    this.navigateTo('risk-breakdown');
  }

  onGenerateRoadmap(): void {
    this.navigateTo('roadmap');
  }

  onFinish(): void {
    this.navigateTo('summary');
  }

  private createInitialMockAssessment(): AssessmentData {
    return {
      tasks: this.generateMockTaskAnalysis([]),
      aiCapabilities: [
        'Generating boilerplate code from specifications',
        'Summarizing documentation and meeting notes',
        'Identifying common bug patterns',
        'Drafting standard communications',
      ],
      aiLimitations: [
        'Negotiating scope with non-technical stakeholders',
        'Making architectural decisions with incomplete information',
        'Navigating ambiguous requirements',
        'Mentoring junior team members',
      ],
      signalStrength: 'moderate',
      riskScore: 47,
      roadmapActions: [
        {
          title: 'Shift from execution to judgment in code review',
          description:
            'Your current reviews focus on correctness and style. AI handles this well.',
          mechanism:
            'Focus reviews on architectural implications, long-term maintainability, and cross-system impact. Document trade-off reasoning, not just approval.',
          impact: 'Moves code review from high → low exposure',
        },
        {
          title: 'Own ambiguous problem definition',
          description:
            'Requirements clarification remains high-judgment work. Position yourself as the person who translates vague business needs into scoped technical work.',
          mechanism:
            'Drive problem framing, define constraints, and turn ambiguity into decisions others rely on.',
          impact: 'Creates dependency on synthesis ability, not output volume',
        },
        {
          title: 'Reduce documentation; increase decision documentation',
          description:
            'AI drafts docs. It cannot explain why a decision was made, what was considered, and what was rejected.',
          mechanism:
            'Keep a lightweight decision log focused on trade-offs and rejected options.',
          impact: 'Shifts documentation from high → medium exposure',
        },
      ],
    };
  }

  private generateMockTaskAnalysis(taskDescriptions: string[]): Task[] {
    const defaultsConst = [
      {
        description: 'Writing unit tests',
        exposure: 'high',
        reason: 'Automated test generation is production-ready',
      },
      {
        description: 'Debugging legacy code',
        exposure: 'medium',
        reason: 'Pattern recognition is strong, but context gaps remain',
      },
      {
        description: 'Technical documentation',
        exposure: 'high',
        reason: 'Summarization and drafting are mature',
      },
      {
        description: 'Sprint planning',
        exposure: 'low',
        reason: 'Requires negotiation, politics, judgment',
      },
      {
        description: 'Mentoring juniors',
        exposure: 'low',
        reason: 'Relationship-dependent, trust-based',
      },
    ] as const satisfies readonly Task[];

    const defaults = defaultsConst.map(t => ({ ...t }));

    if (!taskDescriptions?.length) return defaults;

    // Replace descriptions with user-provided tasks where possible
    return defaults.map((t, idx) => ({
      ...t,
      description: taskDescriptions[idx] ?? t.description,
    }));
  }
}
